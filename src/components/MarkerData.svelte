<script lang="ts">
    import type { LatLng } from "leaflet";
    import "$lib/validators/SoilData"
    import { createEventDispatcher } from "svelte";
    import { SoilReportSchema, type SoilReport } from "$lib/validators/SoilData";
    const dispatcher = createEventDispatcher();
    export let activeMarker:LatLng;

    let soilReport: SoilReport[] = [];
    let soilReportInput: Partial<SoilReport> = {};
    let editMode = false;
    const soilTypes = [{type:"Clay", value:1}, {type:"Sand", value: 2}, {type:"Slit", value:3}, {type:"Loams", value:4}, {type:"Peat", value:5}, {type:"Chalky", value:6}]

    function addToTable() {

        const parsed = SoilReportSchema.safeParse(soilReportInput);
        if(parsed.success) {
            soilReport = [...soilReport, parsed.data]
        }else {
            console.log(parsed.error);
        }
    }

    function removeFromTable(index: number) {
        soilReport.splice(index,1);
        soilReport = [...soilReport];
    }
</script>

<main class="w-full h-full p-5 border-2 rounded-t-lg bg-slate-50 border-slate-300">
    <div class="flex items-center justify-end -mt-2 -mr-1">
        <button on:click={() => dispatcher('closeTrigger') }>
            <i class="fa-solid fa-xmark"></i>
        </button>
    </div>
    <h4 class="mx-2 mb-3 text-lg font-semibold">Location Info</h4>
    <div class="grid w-full gap-2 p-3 my-4 mb-6 text-sm border-2 rounded-md border-slate-200">
        <span>Latitude : <span class="font-semibold">{activeMarker.lat}</span></span>
        <span>Longitude : <span class="font-semibold">{activeMarker.lng}</span></span>
        <span>Place : </span>
        <span>Pincode : </span>
    </div>
    <h4 class="mx-2 my-3 text-lg font-semibold">Report</h4>
    <table class="w-full mt-3 shadow-md">
        <tr class="text-sm border-2 bg-slate-200 border-slate-300" >
            <th class="w-1/2 p-2 border-r-2 border-slate-300">Depth</th> <th class="w-1/2 p-2">Type</th> <th></th>
        </tr>
        {#if !soilReport.length}
            <tr class="text-center">
                <td class="p-3 text-sm text-slate-500" colspan="2">No data</td>
            </tr>
        {/if}
        {#each soilReport as data,index }
        <tr class="border-b-2 border-slate-200">
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
        {/each}
    </table>
    {#if editMode}
    <div>
        <form class="flex-row gap-2 mt-5 form-control" action="">
            <select bind:value={soilReportInput.depth} class="w-full select select-bordered" name="depth" id="depth">
                <option value="5">5ft</option>
                <option value="10">10ft</option>
                <option value="15">15ft</option>
                <option value="20">20ft</option>
                <option value="25">25ft</option>
            </select>
            <select bind:value={soilReportInput.type} class="w-full select select-bordered" name="type" id="type">
                {#each soilTypes as type }
                    <option value={type.value}>{type.type}</option>
                {/each}
            </select>
            <button type="button" on:click={addToTable} class="btn btn-accent"><i class="text-white scale-125 fa-solid fa-plus"></i></button>
        </form>

        {#if soilReport.length}
        <button on:click={() => editMode = false} class="w-full my-4 text-white btn btn-primary">
            <i class="fa-solid fa-floppy-disk"></i> Save
        </button>
        {:else}
        <button on:click={() => editMode = false} class="w-full my-4 text-white btn btn-error">
            <i class="fa-solid fa-xmark"></i> Cancel
        </button>
        {/if}
    </div>
    {:else}
        <button on:click={() => editMode = true} class="w-full my-4 font-bold text-white btn btn-primary"> 
            <i class="fa-solid fa-pen-to-square"></i> Edit 
        </button>
    {/if}
</main>