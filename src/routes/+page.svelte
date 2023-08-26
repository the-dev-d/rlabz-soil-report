<script lang="ts">
    import type { LatLng, LeafletMouseEvent } from "leaflet";
    import LeafletMaps from "../components/LeafletMaps.svelte";
    import MarkerData from "../components/MarkerData.svelte";

    let activeMarker: LatLng|null = null;
    $: activeStyle = activeMarker ? 'top:'+ (1/12)*100 + '%' : 'top:100%';

    function setMarker(e:CustomEvent<LeafletMouseEvent>) {
        console.log(e);
        const {latlng} = e.detail;
        activeMarker = latlng;
    }

    function closeMarker() {
        activeMarker = null;
    }
</script>

<main class="w-full h-screen overflow-hidden bg-red-300">
    <div class="w-full h-full relative">
        <div class="w-full h-full z-10">
            <LeafletMaps on:marker={setMarker}> </LeafletMaps>
        </div>
        
        <div style={activeStyle} class={"w-full px-2 pt-2 h-11/12 z-1100 absolute bottom-0 left-0 transition-all"}>
            <div class="box-border w-full h-full">
                {#if activeMarker}
                    <MarkerData {activeMarker} on:closeTrigger={closeMarker}> </MarkerData>
                {/if}
            </div>
        </div>
    </div>
</main>