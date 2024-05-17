ymaps.ready(init);

function init() {
    var myPlacemark,
        myMap = new ymaps.Map('map', {
            center: [56.0160, 93.0305],
            zoom: 12,
            controls: [],
        }, {
            suppressMapOpenBlock: true,
            searchControlProvider: 'yandex#search',
            suppressObsoleteBrowserNotifier: true,
            minZoom: 12,
        });
    // Создадим пользовательский макет ползунка масштаба.
        ZoomLayout = ymaps.templateLayoutFactory.createClass("<div class='zoom_buttons_block'>" +
            "<div id='zoom-in' class='btn'>+</div><br>" +
            "<div id='zoom-out' class='btn'>-</div>" +
            "</div>", {

            // Переопределяем методы макета, чтобы выполнять дополнительные действия
            // при построении и очистке макета.
            build: function () {
                // Вызываем родительский метод build.
                ZoomLayout.superclass.build.call(this);

                // Привязываем функции-обработчики к контексту и сохраняем ссылки
                // на них, чтобы потом отписаться от событий.
                this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
                this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);

                // Начинаем слушать клики на кнопках макета.
                $('#zoom-in').bind('click', this.zoomInCallback);
                $('#zoom-out').bind('click', this.zoomOutCallback);
            },

            clear: function () {
                // Снимаем обработчики кликов.
                $('#zoom-in').unbind('click', this.zoomInCallback);
                $('#zoom-out').unbind('click', this.zoomOutCallback);

                // Вызываем родительский метод clear.
                ZoomLayout.superclass.clear.call(this);
            },

            zoomIn: function () {
                var map = this.getData().control.getMap();
                map.setZoom(map.getZoom() + 1, {checkZoomRange: true});
            },

            zoomOut: function () {
                var map = this.getData().control.getMap();
                map.setZoom(map.getZoom() - 1, {checkZoomRange: true});
            }
        })
        zoomControl = new ymaps.control.ZoomControl({options: {layout: ZoomLayout}});

    myMap.controls.add(zoomControl);
    myMap.controls.add('geolocationControl');

    //Формируем геобъёкты по параметрам
    objectManager = new ymaps.ObjectManager({
        // Чтобы метки начали кластеризоваться, выставляем опцию.
        clusterize: false,
        // ObjectManager принимает те же опции, что и кластеризатор.
        gridSize: 64,
        // Макет метки кластера pieChart.
        clusterIconLayout: "default#pieChart",
        // geoObjectBalloonLayout: MyBalloonContentLayout,
        geoObjectHideIconOnBalloonOpen: false,
        openBalloonOnClick: false,
        hasHint: false
    });

     function onZonesLoad(json) {
     // Добавляем зоны на карту.
     var deliveryZones = ymaps.geoQuery(json).addToMap(myMap);
     // Задаём цвет и контент балунов полигонов.
     deliveryZones.each(function (obj) {
         obj.options.set({
             fillColor: obj.properties.get('fill'),
             fillOpacity: obj.properties.get('fill-opacity'),
             strokeColor: obj.properties.get('stroke'),
             strokeWidth: obj.properties.get('stroke-width'),
             strokeOpacity: obj.properties.get('stroke-opacity')
         });
     });

    // По окончании перемещения метки вызываем функцию выделения зоны доставки.

    }

    //Подгружаем json с ограниченной территорией
    var GetStaticUrl = document.getElementById("GetStaticUrl").innerHTML;
    //Подгружаем json с ограниченной территорией
    $.ajax({
        url: `${GetStaticUrl}js/data.geojson`,
        dataType: 'json',
        success: onZonesLoad
    });

    //Подгружаем json с метками
    $.ajax({
        url: `${GetStaticUrl}js/data.json`,
    }).done(function (data) {
        objectManager.add(data);
    });

    // Выводим геобъекты на карту
    myMap.geoObjects.add(objectManager);

    // Вывод содержимого объекта в модальное окно
    objectManager.objects.events.add('click', function (e) {

        //По клику на объект на карте, нажимается кнопка открытия Sidebar'а
        // document.getElementById("openNav").checked = true;

        var objectId = e.get('objectId'),
            object = objectManager.objects.getById(objectId);

        document.getElementById("content_id").innerHTML = object.properties.content_id;
        document.getElementById("content_pub_date").innerHTML = object.properties.content_pub_date;
        document.getElementById("content_address").innerHTML = object.properties.content_address;
        document.getElementById("content_description").innerHTML = object.properties.content_description;
        document.getElementById("content_first_name").innerHTML = object.properties.content_first_name;
        document.getElementById("content_middle_name").innerHTML = object.properties.content_middle_name;
        document.getElementById("content_last_name").innerHTML = object.properties.content_last_name;
        document.getElementById("content_status").innerHTML = object.properties.content_status;
        var img1 = document.getElementById("content_image1").src = object.properties.content_image1;
        document.getElementById("content_image1").innerHTML = img1;



        w3_open()


    });
    // Слушаем клик на карте.
    myMap.events.add('click', function (e) {
        var coords = e.get('coords');
        document.getElementById("id_coordinates_latitude").value = coords[0].toPrecision(8)
        document.getElementById("id_coordinates_longitude").value = coords[1].toPrecision(8)

        // Если метка уже создана – просто передвигаем ее.
        if (myPlacemark) {
            myPlacemark.geometry.setCoordinates(coords);
        }
        // Если нет – создаем.
        else {
            myPlacemark = createPlacemark(coords);
            myMap.geoObjects.add(myPlacemark);
            // Слушаем событие окончания перетаскивания на метке.
            myPlacemark.events.add('dragend', function () {
                getAddress(myPlacemark.geometry.getCoordinates());

            });
        }
        getAddress(coords);
    });

    // Создание метки.
    function createPlacemark(coords) {
        return new ymaps.Placemark(coords, {
            iconCaption: 'поиск...'
        }, {
            preset: `${GetStaticUrl}images/mark-map-same.svg`,
            iconLayout: "default#image",
            iconImageHref: `${GetStaticUrl}images/mark-map-same.svg`,
            draggable: false
        });
    }


    // Определяем адрес по координатам (обратное геокодирование).
    function getAddress(coords) {
        myPlacemark.properties.set('iconCaption');
        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);
            if (!myMap.balloon.isOpen()) {
                myMap.balloon.open(coords, {
                    contentHeader: '<p class="mt-2">Заполнить форму обращения</p>',
                    contentBody:
                        '<p style="font-size: 14px">Укажите меткой на карте проблемный участок, <br>' +
                        'а также расскажите нам что случилось</p>' +
                        '<p style="font-size: 14px">Мы рассмотрим вашу заявку в ближайщее время </p>' +
                        '<p style="font-size: 14px">После проверки формы, данные появятся на карте, <br>после этого вы ' +
                        'сможете отслеживать <br> статус обращения </p>' +
                        '<p style="font-size: 14px">Все обращения и отчет о проделанной <br>' +
                        'работе публикуются в наших социальных сетях</p>' +
                        '<button type="button"' +
                        'class="btn btn-primary" ' +
                        'data-toggle="modal" ' +
                        'data-target="#exampleModal" ' +
                        'data-whatever="">Заполнить форму</button>',

                    contentFooter: '<sup></sup>'

                });
            } else {
                myMap.balloon.close();
                myMap.balloon.open(coords);
            }
            document.getElementById("id_address").value = firstGeoObject.getAddressLine();
        });
    }


    // Создадим фильтр со статусами по обращениям
    var listBoxItems = ['Опубликовано', 'Обращение отправлено', 'Выполнено', 'Не выполнено']
            .map(function (title) {
                return new ymaps.control.ListBoxItem({
                    data: {
                        content: title
                    },
                    state: {
                        selected: true
                    }
                })
            }),
        reducer = function (filters, filter) {
            filters[filter.data.get('content')] = filter.isSelected();
            return filters;
        },
        // Теперь создадим список, содержащий 5 пунктов.
        listBoxControl = new ymaps.control.ListBox({
            data: {
                content: 'Фильтр обращений',
                title: 'Фильтр'
            },
            items: listBoxItems,
            state: {
                // Признак, развернут ли список.
                expanded: true,
                filters: listBoxItems.reduce(reducer, {})
            }
        });
    myMap.controls.add(listBoxControl);

    // Добавим отслеживание изменения признака, выбран ли пункт списка.
    listBoxControl.events.add(['select', 'deselect'], function (e) {
        var listBoxItem = e.get('target');
        var filters = ymaps.util.extend({}, listBoxControl.state.get('filters'));
        filters[listBoxItem.data.get('content')] = listBoxItem.isSelected();
        listBoxControl.state.set('filters', filters);
    });

    var filterMonitor = new ymaps.Monitor(listBoxControl.state);
    filterMonitor.add('filters', function (filters) {
        // Применим фильтр.
        objectManager.setFilter(getFilterFunction(filters));
    });

    function getFilterFunction(categories) {
        return function (obj) {
            var content = obj.properties.balloonContent;
            return categories[content]
        }
    }
}