
<script lang="ts">
    import Calendar from "lucide-svelte/icons/calendar";
    import House from "lucide-svelte/icons/house";
    import Inbox from "lucide-svelte/icons/inbox";
    import Search from "lucide-svelte/icons/search";
    import Settings from "lucide-svelte/icons/settings";

    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

    import CompanySelection from "$lib/components/ui/CompanySelection.svelte";

    import {ChevronDown, Clock3, FilePlus2, FileText, LayoutDashboard, Shell} from "lucide-svelte";
    import type {Company} from "$lib/types";


    const companies : Company[] = [
        {
            name: "KevinCompany",
            icon: Shell
        },
        {
            name: "Test",
            icon: Shell
        },
    ]

    const navMain = [
        {
            title: "Invoices",
            url: "#",
            items: [
                {
                    title: "Dashboard",
                    url: "#",
                },
                {
                    title: "History",
                    url: "#",
                },
                {
                    title: "Create",
                    url: "#",
                },
            ],
        },
    ];
</script>

<Sidebar.Root collapsible="icon">
    <Sidebar.Header>
            <CompanySelection companies={companies} defaultCompany={companies[0]}/>
    </Sidebar.Header>
    <Sidebar.Content>
        <!-- We create a Sidebar.Group for each parent. -->
        {#each navMain as group (group.title)}
            <Sidebar.Group>
                <Sidebar.GroupLabel>{group.title}</Sidebar.GroupLabel>
                <Sidebar.GroupContent>
                    <Sidebar.Menu>
                        {#each group.items as item (item.title)}
                            <Sidebar.MenuItem>
                                <Sidebar.MenuButton isActive={item.isActive}>
                                    {#snippet child({ props })}
                                        <a href={item.url} {...props}>{item.title}</a>
                                    {/snippet}
                                </Sidebar.MenuButton>
                            </Sidebar.MenuItem>
                        {/each}
                    </Sidebar.Menu>
                </Sidebar.GroupContent>
            </Sidebar.Group>
        {/each}
    </Sidebar.Content>
    <Sidebar.Rail />
</Sidebar.Root>

