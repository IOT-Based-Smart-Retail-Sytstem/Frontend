"use client";
import { useEffect, useState } from "react";
import { IProduct } from "@/interfaces";
import {
  deleteProduct,
  getAllProducts,
} from "@/app/api/actions/productActions";
import { ProductTableSkeleton } from "../../../_components/ProductTableSkeleton";
import DataTables from "../../../_components/DataTable";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
// import { io } from "socket.io-client";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { ProductDialog } from "./ProductDialog";
import { MoreHorizontal, Eye, PenIcon, Trash } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { RestockShelf } from "./RestockShelf";
import { useDashboardContext } from "@/context/dashboardContext";

export function ProductTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [data, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [restockProduct, setRestockProduct] = useState<{
    name: string;
    id: string;
    state: string;
    stock: number;
    maxStock: number;
  }>({
    name: "",
    id: "",
    state: "",
    stock: 0,
    maxStock: 400,
  });

  const { setAvailableItems, setLowItems, setOutItems } = useDashboardContext();

  const columns: ColumnDef<IProduct>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            className="p-0 text-black text-base font-semibold"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Product Name
            <Icon icon="fa6-solid:sort" width="14" height="14" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const statusVal = row.getValue("stockState");
        return (
          <div
            className={cn(
              "capitalize",
              statusVal === "out" && "text-primaryRed",
              statusVal === "low" && "text-[#FF8714]"
            )}
          >
            {row.getValue("title")}
          </div>
        );
      },
    },
    {
      accessorKey: "barcode",
      header: "Barcode",
      cell: ({ row }) => {
        const statusVal = row.getValue("stockState");
        return (
          <div
            className={cn(
              "capitalize",
              statusVal === "out" && "text-primaryRed",
              statusVal === "low" && "text-[#FF8714]"
            )}
          >
            {row.getValue("barcode")}
          </div>
        );
      },
    },
    {
      accessorKey: "shelfNumber",
      header: "Shelf No.",
      cell: ({ row }) => {
        return <div className="ml-5">{row.getValue("shelfNumber")}</div>;
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button
            className="p-0 text-black text-base font-semibold"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            <Icon icon="fa6-solid:sort" width="14" height="14" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("price"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "EGP",
        }).format(amount);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "stock",
      header: ({ column }) => {
        return (
          <Button
            className="p-0 text-black text-base font-semibold"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Stock
            <Icon icon="fa6-solid:sort" width="14" height="14" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("stock"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "decimal",
        }).format(amount);
        const statusVal = row.getValue("stockState");
        return (
          <div className="font-medium flex items-center text-medGray">
            {formatted === "0" && (
              <Icon
                icon="fluent-mdl2:error-badge"
                width="18"
                height="18"
                className="text-primaryRed mr-1.5"
              />
            )}
            <span
              className={cn(
                formatted === "0" && "text-primaryRed",
                statusVal === "available" && "text-black",
                statusVal === "low" && "text-[#FF8714]",
                statusVal === "out" && "text-primaryRed"
              )}
            >
              {formatted} pcs
            </span>
            /400
          </div>
        );
      },
    },
    {
      accessorKey: "categories",
      header: ({ column }) => {
        return (
          <Button
            className="p-0 text-black text-base font-semibold"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Category
            <Icon icon="fa6-solid:sort" width="14" height="14" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize ml-3">{row.getValue("categories")}</div>
      ),
    },
    {
      accessorKey: "stockState",
      header: "State",
      cell: ({ row }) => {
        const statusVal = row.getValue("stockState");
        return (
          <div
            className={cn(
              "capitalize flex items-center text-white w-fit rounded-lg text-base font-semibold",
              statusVal === "available" && "text-green-500",
              statusVal === "low" && "bg-[#FFDBB980] text-[#FF7D00] px-2 py-1",
              statusVal === "out" && "bg-[#FFECEC] text-primaryRed px-2 py-1"
            )}
          >
            {statusVal === "low" && (
              <Icon
                icon="si:warning-line"
                width="17"
                height="17"
                className="mr-1.5"
              />
            )}
            {statusVal === "out" && (
              <Icon
                icon="fluent-mdl2:error-badge"
                width="17"
                height="17"
                className="mr-1.5"
              />
            )}
            {row.getValue("stockState")}
          </div>
        );
      },
    },
    {
      accessorKey: " ",
      cell: ({ row }) => {
        const statusVal = row.getValue("stockState");
        const product = row.original;

        return (
          <div
            className={cn(
              "capitalize flex items-center text-medGray cursor-pointer",
              statusVal === "low" && "text-[#FF8714]",
              statusVal === "out" && "text-primaryRed"
            )}
            onClick={() => {
              setRestockProduct({
                name: product.title,
                id: product._id,
                state: product.stockState,
                stock: product.stock,
                maxStock: 400,
              });
              setIsRestockOpen(true);
            }}
          >
            <Icon
              icon="dashicons:update"
              width="23"
              height="23"
              className="mr-[6px]"
            />
            Restock
          </div>
        );
      },
    },
    {
      accessorKey: "Actions",
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const id = row.original._id as string;

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem
                  onSelect={() => {
                    setIsDialogOpen(true);
                    setSelectedProductId(id);
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    className="flex items-center w-full"
                    href={`/dashboard/inventory/edit/${id}`}
                  >
                    <PenIcon className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    deleteProduct(id);
                    toast.success("Product deleted successfully");
                    setProducts((prev) => prev.filter((itm) => itm._id !== id));
                  }}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const res = await getAllProducts();
        setProducts(res?.data.data.products);
        console.log({ data });
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
    console.log("update");

    setAvailableItems(
      data.filter((itm) => itm.stockState === "available").length
    );
    setLowItems(data.filter((itm) => itm.stockState === "low").length);
    setOutItems(data.filter((itm) => itm.stockState === "out").length);
  }, [data]);

  // const SOCKET_URL =
  //   "https://faint-ilyse-iot-based-smart-retail-system-897f175c.koyeb.app/shelf";

  // useEffect(() => {
  //   const socket = io(SOCKET_URL, {
  //     transports: ["websocket"],
  //   });

  //   socket.on("connect", () => {
  //     console.log("🔗 Connected to shelf socket: ", socket.id);
  //   });

  //   socket.on("shelf-state-update", (response) => {
  //     if (response.success) {
  //       const updatedProduct = response.product;
  //       setProducts((prevProducts) =>
  //         prevProducts.map((product) =>
  //           product._id === updatedProduct._id
  //             ? { ...product, stockState: updatedProduct.shelfState }
  //             : product
  //         )
  //       );
  //     } else {
  //       console.error("Shelf update failed:", response);
  //     }
  //   });

  //   socket.on("disconnect", () => {
  //     console.log("Disconnected from shelf socket");
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  if (loading) return <ProductTableSkeleton />;

  if (isDialogOpen)
    return (
      <ProductDialog
        key={selectedProductId}
        id={selectedProductId}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        setProducts={setProducts}
      />
    );

  if (restockProduct && isRestockOpen) {
    return (
      <RestockShelf
        productId={restockProduct.id}
        productName={restockProduct.name}
        productState={restockProduct.state}
        currentStock={restockProduct.stock}
        maxStock={restockProduct.maxStock}
        onRestockSuccess={(updatedProduct) => {
          console.log({ updatedProduct });

          setProducts((prev) =>
            prev.map((p) =>
              p._id === restockProduct.id
                ? {
                    ...p,
                    stock: updatedProduct.stock,
                    stockState: updatedProduct.stockState,
                  }
                : p
            )
          );
          setIsRestockOpen(false);
        }}
        onClose={() => setIsRestockOpen(false)}
      />
    );
  }

  return <DataTables table={table} page={"products"} />;
}
