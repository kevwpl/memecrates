<script lang="ts">
    import * as Pagination from "$lib/components/ui/pagination";
    import * as Select from "$lib/components/ui/select/index.js";
    import type {PaginationState, Table} from "@tanstack/table-core";
    import ChevronLeft from "lucide-svelte/icons/chevron-left";
    import ChevronRight from "lucide-svelte/icons/chevron-right";
    import {t} from "$lib/i18n.svelte";

    let { table, pagination } : { table: Table<any>, pagination: PaginationState} = $props();

    let pageSizeString = $state("10")

    $effect(() => {
        pagination.pageSize = parseInt(pageSizeString);
    })

</script>
<div class="grid grid-cols-12 mt-4">
    <div class="col-span-2">

    </div>
    <div class="col-span-8">
        <Pagination.Root
                count={table.getRowCount()}
                perPage={pagination.pageSize}
                onPageChange={(p) => {table.setPageIndex(p - 1)}}
                class="mt-2">
            {#snippet children({ pages, currentPage, range })}
                <Pagination.Content>
                    <Pagination.Item>
                        <Pagination.PrevButton>
                            <ChevronLeft class="size-4" />
                            <span class="hidden sm:block">{t("pagination.previous")}</span>
                        </Pagination.PrevButton>
                    </Pagination.Item>
                    {#each pages as page (page.key)}
                        {#if page.type === "ellipsis"}
                            <Pagination.Item>
                                <Pagination.Ellipsis />
                            </Pagination.Item>
                        {:else}
                            <Pagination.Item isVisible={currentPage === page.value}>
                                <Pagination.Link  {page} isActive={currentPage === page.value} >
                                    {page.value}
                                </Pagination.Link>
                            </Pagination.Item>
                        {/if}
                    {/each}
                    <Pagination.Item>
                        <Pagination.NextButton>
                            <span class="hidden sm:block">{t("pagination.next")}</span>
                            <ChevronRight class="size-4" />
                        </Pagination.NextButton>
                    </Pagination.Item>
                </Pagination.Content>
                <p class="text-center text-[13px] mt-2 text-muted-foreground">
                    {t("pagination.results")} {range.start + 1} - {range.end}
                </p>
            {/snippet}
        </Pagination.Root>
    </div>
    <div class="col-span-2 flex justify-end mt-2">
        <Select.Root type="single" bind:value={pageSizeString}>
            <Select.Trigger class="w-[180px]">{pageSizeString}</Select.Trigger>
            <Select.Content>
                <Select.Item value="5" label="5" />
                <Select.Item value="10" label="10" />
                <Select.Item value="20" label="20" />
                <Select.Item value="50" label="50" />
            </Select.Content>
        </Select.Root>
    </div>
</div>