<script lang="ts">
  
    import Button, { Label } from '@smui/button';

    import "$lib/validators/SoilData"
    import { createEventDispatcher } from "svelte";
    import { SoilDataSchema, type SoilData, type LatLng, type Place, type Pins } from "$lib/validators/SoilData";

    const dispatcher = createEventDispatcher();
    export let activeMarker:Partial<LatLng & {mark:string, color: string}>;
    let place: Partial<Place> = {placeName: "Kalamassery", placeId: 0, pin: {colorCode: "none", mark:"none", pin: "none"}};
    
    let soilData: SoilData[] = [];
    loadSoilReport();
    loadPins();

    let soilDataInput: Partial<SoilData> = {};
    let editMode = false;

    const soilTypes = [{type:"Clay", value:1}, {type:"Sand", value: 2}, {type:"Slit", value:3}, {type:"Loams", value:4}, {type:"Peat", value:5}, {type:"Chalky", value:6}]
    const depthOptions = ["5","10","15","20","25","30","35"];
    $: depthOptionsView = depthOptions.filter( opt => ! soilData.some(data => data.status != false && data.depth == +opt));    

    async function loadPins() {
        const res = await fetch('/api/pin');
        const parsed = await res.json();
        pins = parsed.response as Pins[];
    }
    async function loadSoilReport() {
        const res = await fetch(`/api/soilreport?lat=${activeMarker.lat}&lng=${activeMarker.lng}`);
        const data = await res.json();
        place = data.response.location.place;
        activeMarker.pinId = data.response.location.pinId;
        soilData = data.response.report.map( val => ({...val, status: true}));       

    }
    function addToTable() {

        const parsed = SoilDataSchema.safeParse(soilDataInput);        
        if(parsed.success) {
            soilData = [...soilData, parsed.data];
            console.log(soilData);
            
        }else {
            console.log(parsed.error);
        }
    }

    function removeFromTable(index: number) {
        soilData[index].status = false;
    }

    async function saveReport() {
        await fetch("/api/soilreport", {
            method: "POST",
            body: JSON.stringify({
                position: activeMarker,
                place,
                report: soilData
            })
        })
        editMode = false;
    }

    let pins: Pins[] = [];
</script>

<main class="flex flex-col w-full h-full p-5 border-2 rounded-t-lg bg-slate-50 border-slate-300">
    <div class="flex items-center justify-end -mt-2 -mr-1">
        <button on:click={() => dispatcher('closeTrigger') }>
            <i class="fa-solid fa-xmark"></i>
        </button>
    </div>
    <section class="h-[90vh] overflow-y-auto">
        <div class="grid w-full gap-2 p-4 my-4 mb-8 border-2 rounded-md border-slate-200">
            <h4 class="mb-3 text-lg font-semibold">Location Info</h4>
            <span>Latitude : <span class="font-semibold">{activeMarker.lat}</span></span>
            <span>Longitude : <span class="font-semibold">{activeMarker.lng}</span></span>
            <span>Place : <input bind:value={place.placeName} type="text" name="place" id=""> </span>
            <div class="flex font-semibold">Marked as 
                {#if activeMarker.pinId}
                    {@const index = pins.findIndex( pin => pin.colorCode == activeMarker.pinId)}
                    <div><span style={"background : #"+activeMarker.pinId+";"} class="px-2.5 mx-2 uppercase rounded-full shadow-2xl bg-opacity-20 "></span> 
                        {#if pins[index]}
                            <span class="uppercase">{pins[index]["mark"]}</span>
                        {/if}
                    </div> 
                {/if}
            </div>
        </div>
        <table class="w-full mt-3 shadow-md">
            <tr class="text-sm border-2 bg-primary-low border-slate-300" >
                <th class="w-1/2 p-2 border-r-2 border-slate-300">Depth</th> <th class="w-1/2 p-2">Type</th> <th></th>
            </tr>
            {#if !soilData.length}
                <tr class="text-center">
                    <td class="p-3 text-sm text-slate-500" colspan="2">No data</td>
                </tr>
            {/if}
            {#each soilData as data,index (index) }
            {#if data.status != false}
            <tr  class="border-b-2 border-slate-200">
                <td class="px-3 py-1 border-r-2 border-slate-200">{data.depth} Ft</td>
                <td class="px-3 py-1">{soilTypes.filter((type) => type.value == data.type)[0].type}</td>
                {#if editMode}
                <td>
                    <button class="btn btn-ghost btn-circle" on:click={() => removeFromTable(index)}>
                        <i class="scale-125 fa-solid text-error fa-trash"></i> 
                    </button>
                </td>
                {/if}
            </tr>
            {/if}           
            {/each}
        </table>
        {#if editMode}
        <div>
            <form class="flex-row gap-2 mt-5 form-control" action="">
                <select bind:value={soilDataInput.depth} class="w-full select select-bordered" name="depth" id="depth">
                    {#each depthOptionsView as option (option) }
                        <option value={option}>{option}ft</option>
                    {/each}
                </select>
                <select bind:value={soilDataInput.type} class="w-full select select-bordered" name="type" id="type">
                    {#each soilTypes as type }
                        <option value={type.value}>{type.type}</option>
                    {/each}
                </select>
                <button type="button" on:click={addToTable} class="btn btn-accent"><i class="text-white scale-125 fa-solid fa-plus"></i></button>
            </form>

            <div class="flex items-center p-4 my-4 rounded-md">
                <div id="markers" class="flex gap-4">
                    {#each pins as pin}
                        <span class="flex">
                            <input value={pin.colorCode} bind:group={activeMarker.pinId} class="w-0 opacity-0 peer" type="radio" name="marker" id={pin.colorCode}>
                            <label for={pin.colorCode} class={`p-5 peer-checked:border-slate-500 border-4 rounded-xl`} style={`background-color: #${pin.colorCode}`}></label>
                        </span>
                    {/each}
                </div>
            </div>
    
            {#if soilData.length}
            <Button class="w-full my-4" on:click={() => saveReport()} variant="raised">
                <Label>Save</Label>
            </Button>
            {:else}
            <Button class="w-full my-4" on:click={() => editMode = false} color="secondary" variant="raised">
                <Label>Cancel</Label>
            </Button>
            {/if}
        </div>
        {:else}
            <Button class="w-full my-4" on:click={() => editMode = true} variant="raised">
                <Label>Edit</Label>
            </Button>
        {/if}
    </section>
</main>