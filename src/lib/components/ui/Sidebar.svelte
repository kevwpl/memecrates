<script lang="ts">
    import { t } from "$lib/i18n.svelte";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

    import CompanySelection from "$lib/components/ui/CompanySelection.svelte";

    import {Clock3, FilePlus, LayoutDashboard, Shell} from "lucide-svelte";
    import type {Company} from "$lib/types";
    import GalleryVerticalEnd from "lucide-svelte/icons/gallery-vertical-end";

    let companies : Company[] = $state([
        {
            name: "Laden",
            street: "Kinostraße 14/2",
            zip: 3680,
            town: "Persenbeug",
            uuid: "ATU12345678",
            icon: GalleryVerticalEnd,
        }
    ]);

    const navMain = [
        {
            title: t("nav.invoices"),
            url: "#",
            items: [
                {
                    title: t("nav.dashboard"),
                    url: "#",
                    icon: LayoutDashboard
                },
                {
                    title: t("nav.history"),
                    url: "#",
                    icon: Clock3
                },
                {
                    title: t("nav.create"),
                    url: "#",
                    icon: FilePlus
                },
            ],
        },
    ];

    async function fetchCompanies(
        endpoint: string,
        sessionToken: string
    ){
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ sessionToken }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                return { error: errorResponse.error || "An unknown error occurred" };
            }

            const data = await response.json();
            companies = data;
            console.log(data)
        } catch (error) {
            console.error("Error in getCompanies:", error);
            return { error: "Failed to fetch companies" };
        }
    }

    $effect.pre(() => {
        fetchCompanies("/api/get/company", sessionStorage.getItem("token") || "");
    })
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
                                {@const Icon = item.icon}
                                <Sidebar.MenuButton>
                                    {#snippet child({ props })}
                                        <a href={item.url} {...props}>
                                            <Icon />
                                            {item.title}
                                        </a>
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

