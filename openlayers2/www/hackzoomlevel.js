I figured out a hack that seems to work.

    map.events.register('zoomend', this, function (event) {
        var x = map.getZoom();
       
        if( x < 15)
        {
            map.zoomTo(15);
        }
    });
