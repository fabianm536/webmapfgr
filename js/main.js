dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.DateTextBox");
//map1
var map, toc;
var graphicsArray = [];

require([
  "dojo/dom",
  "dojo/parser",
  "esri/map",
  "esri/layers/FeatureLayer",
  "esri/layers/ArcGISTiledMapServiceLayer",
  "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/geometry",
  "esri/dijit/Scalebar",
  "esri/dijit/Search",
  "esri/dijit/BasemapGallery",
  "esri/arcgis/utils",
  "esri/geometry/Point",
  "esri/geometry/Polygon",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/SpatialReference",
  "esri/graphic",
  "dijit/layout/BorderContainer",
  "dijit/layout/ContentPane",
  "dijit/TitlePane",
  "dojo/domReady!"
], function (
  dom,
  parser,
  Map,
  FeatureLayer, 
  ArcGISTiledMapServiceLayer,
  ArcGISDynamicMapServiceLayer,
  Geometry,
  Scalebar,
  Search,
  BasemapGallery,
  arcgisUtils,
  Point,
  Polygon,
  SimpleMarkerSymbol,
  SimpleFillSymbol,
  SimpleLineSymbol,
  ClassBreaksRenderer,
  Color,
  InfoTemplate,
  SpatialReference,
  Graphic
  ) {
   
    parser.parse();


    map = new Map("map", {
        basemap: "hybrid",
        center: [1.393, 46.525],
        zoom: 5,
        slider: false
    });

    //scalebar
    var scalebar = new esri.dijit.Scalebar({ map: map, scalebarUnit: 'metric' });

    //add the basemap gallery
    var basemapGallery = new BasemapGallery({
        showArcGISBasemaps: true,
        map: map
    }, "basemapGallery");
    basemapGallery.startup();

    basemapGallery.on("error", function (msg) {
        console.log("basemap gallery error:  ", msg);
    });


//map2
    var map2;

    map2 = new Map("map2", {
        basemap: "national-geographic",
        center: [1.393, 46.525],
        zoom: 7,
        slider: false
    });

    //scalebar
    var scalebar = new esri.dijit.Scalebar({ map: map2, scalebarUnit: 'metric', attachTo: "bottom-center" });

    //add the basemap gallery
    var basemapGallery = new BasemapGallery({
        showArcGISBasemaps: true,
        map: map2
    }, "basemapGallery2");
    basemapGallery.startup();

    basemapGallery.on("error", function (msg) {
        console.log("basemap gallery 2 error:  ", msg);
    });

    //extent calcul
    dojo.connect(map2, "onExtentChange", showExtent);


//map3
    var map3;

    map3 = new Map("map3", {
        basemap: "satellite",
        center: [1.393, 46.525],
        zoom: 7,
        slider: false
    });

    //scalebar
    var scalebar = new esri.dijit.Scalebar({ map: map3, scalebarUnit: 'metric', attachTo: "bottom-center" });

    //add the basemap gallery
    var basemapGallery = new BasemapGallery({
        showArcGISBasemaps: true,
        map: map3
    }, "basemapGallery3");
    basemapGallery.startup();

    basemapGallery.on("error", function (msg) {
        console.log("basemap gallery 3 error:  ", msg);
    });

    //extent calcul2
    dojo.connect(map3, "onExtentChange", showExtent2);

    //search
    var search = new Search({
        map: map3,
        enableInfoWindow: false
    }, "search");
    search.startup();



//functions

    function showExtent(extent) {
        var s = "{\"rings\":[[[" + extent.xmin.toFixed(2) + "," + extent.ymin.toFixed(2) + "], ["
           + extent.xmin.toFixed(2) + "," + extent.ymax.toFixed(2) + "], ["
           + extent.xmax.toFixed(2) + "," + extent.ymax.toFixed(2) + "], ["
           + extent.xmax.toFixed(2) + "," + extent.ymin.toFixed(2) + "]]], \"spatialReference\": { \"wkid\": 102100 }}";

        addPolygon(s);
    }

    function showExtent2(extent) {
        var s = "{\"rings\":[[[" + extent.xmin.toFixed(2) + "," + extent.ymin.toFixed(2) + "], ["
           + extent.xmin.toFixed(2) + "," + extent.ymax.toFixed(2) + "], ["
           + extent.xmax.toFixed(2) + "," + extent.ymax.toFixed(2) + "], ["
           + extent.xmax.toFixed(2) + "," + extent.ymin.toFixed(2) + "]]], \"spatialReference\": { \"wkid\": 102100 }}";

        addPolygon2(s);
    }

    function addPolygon(extentStr) {

        if (map.graphics != null) {
            map.graphics.clear();
        }

        var polygonJson = JSON.parse(extentStr);
        var myPolygon = new Polygon(polygonJson);
        var fill = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
            new esri.Color([255, 0, 0]), 2), new esri.Color([255, 255, 0, 0]));
        var gra = new Graphic(myPolygon, fill);

        if (map.graphics != null) {
            map.graphics.add(gra);
        }
        map.setExtent(myPolygon.getExtent().expand(6));
    }

    function addPolygon2(extentStr) {

        if (map2.graphics != null) {
            map2.graphics.clear();
        }

        var polygonJson = JSON.parse(extentStr);
        var myPolygon = new Polygon(polygonJson);
        var fill = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
            new esri.Color([255, 0, 0]), 2), new esri.Color([255, 255, 0, 0]));
        var gra = new Graphic(myPolygon, fill);

        if (map2.graphics != null) {
            map2.graphics.add(gra);
        }

        map2.setExtent(myPolygon.getExtent().expand(6));
    }

   
    function addPoint(x, y, wkid) {

        var sys = { wkid: 4326 };
        sys.wkid = parseInt(wkid);
        
        var rs = new SpatialReference(sys);
        var point = new Point(x, y, rs);
        var pointSymbol = new SimpleMarkerSymbol();
        var pointAttributes = { city: "Albuquerque", state: "New Mexico" };
        //var pointInfoTemplate = new InfoTemplate("Albuquerque");
        var pointGraphic = new Graphic(point, pointSymbol, pointAttributes);
        graphicsArray.push(pointGraphic);
        for (i = 0; i < graphicsArray.length; ++i) {
            map3.graphics.add(graphicsArray[i]);
        }

        map3.centerAndZoom(point, 12);
        
    }

    dojo.addOnLoad(function () {
        var myForm = dijit.byId("myForm");
        dojo.connect(myForm, "onSubmit", function (e) {
            e.preventDefault();
            if (myForm.isValid()) {
                coord = JSON.parse(dojo.toJson(myForm.attr("value")));
                //add point from coord
                map3.on("load", addPoint(coord.coordx, coord.coordy, coord.wkid));

            }
        });
    });



 });

