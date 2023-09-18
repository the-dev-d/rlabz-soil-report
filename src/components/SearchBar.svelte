
<script lang="ts">
    import type { Place } from "@prisma/client";
    import { createEventDispatcher } from "svelte";
    import { fade, slide, fly } from "svelte/transition";
    export let  threshold = 2;
    let autoComplete: Promise<any>|null  = null;
    let selected: boolean = false;
    let input = "";

    async function getAutoCompleteResult() {
        const res = await fetch(`/api/place?search=${input}`);
        const data = await res.json();

        if(res.ok) {            
            return data.response;
        }else {
            return [];
        }
    }
    function handleSearch() {
        autoComplete = null;
        dispatcher('search', input)
    }
    function handleSelect(option: Place) {
        input = option.placeName;
        selected = true;
        autoComplete = null;
        dispatcher('select', option)
    }
    function handleAutoComplete() {
        if(input.length >= threshold) {
            autoComplete = getAutoCompleteResult();
        }else {
            autoComplete = null;
        }
    }
    function handleDeselection() {
        input = "";
        selected = false;
        //TODO: make the markers as default
    }
    const dispatcher = createEventDispatcher();

</script>

<div class="w-full overflow-hidden bg-white border-gray-300 shadow-md rounded-2xl border-1">
    <div class="flex items-center border-b-1">
        {#if selected}
            <div class="flex items-center w-full p-4 focus:outline-none">
                <span>Search in {input} <i on:click={handleDeselection} class="ml-2 fa-solid fa-xmark"></i></span>
            </div>
        {:else}
            <input on:keyup={handleAutoComplete} bind:value={input} class="w-full p-4 focus:outline-none" placeholder="Search Place or Pincode" type="text" name="search" id="search">
            <i on:click={handleSearch} class="p-4 m-1 rounded-full fa-solid fa-magnifying-glass hover:bg-slate-100"></i>
        {/if}
    </div>
    <div class="max-h-[50%] overflow-y-auto bg-white flex flex-col">

        {#if autoComplete !== null}
            {#await autoComplete}
                <span class="mx-auto loading loading-dots loading-md"></span> 
            {:then options} 
                {#each options as option (options.indexOf(option)) }
                    <button on:click={() => handleSelect(option)} class="p-3 text-left focus:bg-slate-100 focus:outline-none hover:bg-slate-100">{option.placeName}</button>
                {/each}
            {/await}
        {/if}
    </div>
</div>