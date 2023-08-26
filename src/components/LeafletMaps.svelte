<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import 'leaflet/dist/leaflet.css';
    import type { Marker } from "leaflet";

    const dispatcher = createEventDispatcher();

    let marker:Marker|null = null;

    onMount( async () => {
        const Leaflet  = await import('leaflet');
        const layer = Leaflet.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', 
        {
            maxZoom: 30,
        });
        const map = Leaflet.map('maps',{
            center: [10.014550, 76.293159],
            zoom: 16,
            layers: [layer]
        });
        map.on('click', (e)=> {
            const {lat, lng} = e.latlng;
            if(marker)
                map.removeLayer(marker);
            marker = new Leaflet.Marker(e.latlng);
            map.addLayer(marker);
            dispatcher('marker',e);
        })
    } )
   

</script>

<section id="maps" class="w-full h-full bg-green-400">

</section>