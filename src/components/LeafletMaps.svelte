<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import 'leaflet/dist/leaflet.css';
    import type { Marker } from "leaflet";
    import type { LatLng } from "$lib/validators/SoilData";

    const dispatcher = createEventDispatcher();

    let activeMarker:Marker|null = null;
    export let markers: LatLng[] = [];

    onMount( async () => {
        const Leaflet  = await import('leaflet');
        const layer = Leaflet.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', 
        {
            maxZoom: 30,
        });
        const map = Leaflet.map('maps',{
            center: markers.length ? [markers[0].lat, markers[0].lng] : [10.014550, 76.293159],
            zoom: 15,
            layers: [layer],
        });
        //TODO: make it center around the avergae value of coordinates
        markers.forEach( position => {
            const m = new Leaflet.Marker(position)
            m.addEventListener('click', e => {
                Leaflet.DomEvent.stopPropagation(e);
                dispatcher('marker', e);
            })
            m.addTo(map);
        })

        map.on('click', (e)=> {
            const {lat, lng} = e.latlng;
            if(activeMarker)
                map.removeLayer(activeMarker);
            activeMarker = new Leaflet.Marker(e.latlng);
            map.addLayer(activeMarker);
            dispatcher('marker',e);
        })
    } )
   

</script>

<section id="maps" class="w-full h-full bg-green-400">

</section>