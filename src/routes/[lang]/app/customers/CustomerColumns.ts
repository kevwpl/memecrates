import type {ColumnDef} from "@tanstack/table-core";
import type {Customer} from "$lib/types";
import {t} from "$lib/i18n.svelte";
import {renderComponent} from "$lib/components/ui/data-table";
import { Checkbox } from "$lib/components/ui/checkbox/index.js";
import CustomerDataTableActions from "./CustomerDataTableActions.svelte";
import DataTableHeaderButton from "$lib/components/ui/DataTableHeaderButton.svelte";

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
                name: t("customers.name")
            }),
    },
    {
        accessorKey: "street",
        header: ({ column }) =>
            renderComponent(DataTableHeaderButton, {
                onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
                sort: column.getIsSorted(),
                name: t("customers.street")
            }),
    },
    {
        accessorKey: "zip",
        header: ({ column }) =>
            renderComponent(DataTableHeaderButton, {
                onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
                sort: column.getIsSorted(),
                name: t("customers.zip")
            }),
    },
    {
        accessorKey: "town",
        header: ({ column }) =>
            renderComponent(DataTableHeaderButton, {
                onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
                sort: column.getIsSorted(),
                name: t("customers.town")
            }),
    },
    {
        accessorKey: "uid",
        header: ({ column }) =>
            renderComponent(DataTableHeaderButton, {
                onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
                sort: column.getIsSorted(),
                name: t("customers.uid")
            }),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return renderComponent(CustomerDataTableActions, { id: row.original.uuid })
        }
    },
];