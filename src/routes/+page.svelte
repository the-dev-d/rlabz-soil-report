<script lang="ts">
    import type { LatLng } from "$lib/validators/SoilData";
    import LeafletMaps from "../components/LeafletMaps.svelte";
    import MarkerData from "../components/MarkerData.svelte";
    import { slide } from "svelte/transition";
    import SearchBar from "../components/SearchBar.svelte";
    import type { LeafletMouseEvent } from "leaflet";
    
    export let data;
    let markers: LatLng[] = data.markers;

    loadMarkers();
    
    let activeMarker: LatLng|null = null;

    function setMarker(e:CustomEvent<LeafletMouseEvent>) {
        const {latlng} = e.detail;
        activeMarker = {...latlng, pinId: "0000ff"};
    }

    function closeMarker() {
        activeMarker = null;
    }

    async function loadMarkers() {
        const res = await fetch(`/api/marker`);
        const data = await res.json();
        markers = data.response as LatLng[];
    }

    function handleSearch(e: CustomEvent<any>) {

    }

    async function handleSelect(e: CustomEvent<any>) {

        const res = await fetch(`/api/marker?placeId=${e.detail.placeId}`);
        const data = await res.json();
        markers = data.response as LatLng[];
        
    }

</script>

<main class="relative w-full h-screen overflow-hidden bg-red-300">
    <div class="absolute top-0 flex w-2/5 gap-2 m-2 -translate-x-1/2 left-1/2 z-1100">
        <SearchBar on:deselect={loadMarkers} on:search={handleSearch} on:select={handleSelect}  threshold={2}></SearchBar>
        <button class="h-full bg-white border-2 border-gray-300 rounded-full shadow-md aspect-square"><i class="fa-solid fa-crosshairs p-3.5"></i></button>
    </div>
    <div class="relative w-full h-full">
        <div class="z-10 w-full h-full">
            {#key markers}
                <LeafletMaps {markers} on:marker={setMarker}> </LeafletMaps>
            {/key}
        </div>
        
        {#if activeMarker}
            <div transition:slide class={"w-full px-2 pt-2 h-screen z-1100 absolute bottom-0 left-0 transition-all"}>
                <div class="box-border w-full h-full">
                    <MarkerData  {activeMarker} on:closeTrigger={closeMarker}> </MarkerData>
                </div>
            </div>
        {/if}
    </div>
</main>