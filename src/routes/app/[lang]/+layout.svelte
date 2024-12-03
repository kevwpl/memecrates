<script lang="ts">
    import * as Sidebar from "$lib/components/ui/sidebar";
    import MainSidebar from "$lib/components/ui/Sidebar.svelte"

    import { page } from '$app/stores';

    import "../../../app.css";

    let { children } = $props();

    let lang : string = "";

    page.subscribe((value) => {
        lang = value.params.lang;
    });
</script>

<Sidebar.Provider>
    <MainSidebar lang={lang}/>
    <main class="w-full">
        <Sidebar.Trigger class="m-2"/>
        <div class="justify-center w-2/3 mx-auto h-full">
            {@render children?.()}
        </div>
    </main>
</Sidebar.Provider>

