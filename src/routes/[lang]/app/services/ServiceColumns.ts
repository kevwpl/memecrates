import type {ColumnDef} from "@tanstack/table-core";
import type {Customer} from "$lib/types";
import {t} from "$lib/i18n.svelte";
import {renderComponent, renderSnippet} from "$lib/components/ui/data-table";
import { Checkbox } from "$lib/components/ui/checkbox/index.js";
import DataTableHeaderButton from "$lib/components/ui/DataTableHeaderButton.svelte";
import {createRawSnippet} from "svelte";

export const columns: ColumnDef<Customer>[] = [
    {
        id: "select",
        header: ({ table }) =>
            renderComponent(Checkbox, {
                checked: table.getIsAllPageRowsSelected(),
                indeterminate:
                    table.getIsSomePageRowsSelected() &&
                    !table.getIsAllPageRowsSelected(),
                onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
                "aria-label": "Select all",
            }),
        cell: ({ row }) =>
            renderComponent(Checkbox, {
                checked: row.getIsSelected(),
                onCheckedChange: (value) => row.toggleSelected(!!value),
                "aria-label": "Select row",
            }),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) =>
            renderComponent(DataTableHeaderButton, {
                onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
                sort: column.getIsSorted(),
                name: t("services.name")
            }),
    },
    {
        accessorKey: "price",
        header: ({ column }) =>
            renderComponent(DataTableHeaderButton, {
                onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
                sort: column.getIsSorted(),
                name: t("services.price")
            }),
        cell: ({ row }) => {
            const formatter = new Intl.NumberFormat("de-AT", {
                style: "currency",
                currency: "EUR",
            });

            const amountCellSnippet = createRawSnippet<[string]>((getPrice) => {
                const price = getPrice();
                return {
                    render: () => `<div class="font-medium">${price}</div>`,
                };
            });

            const value = row.getValue("price");
            const formattedValue = isNaN(value) ? "€ 0.00" : formatter.format(parseFloat(value));
            return renderSnippet(amountCellSnippet, formattedValue);
        }
    },
    {
        accessorKey: "bookings",
        header: ({ column }) =>
            renderComponent(DataTableHeaderButton, {
                onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
                sort: column.getIsSorted(),
                name: t("services.bookings")
            }),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            //return renderComponent(CustomerDataTableActions, { id: row.original.uuid })
        }
    },
];