"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { restock } from "@/app/api/actions/productActions";
import { Icon } from "@iconify/react";
import { Label } from "@/components/ui/label";
import { IProduct } from "@/interfaces";

interface RestockShelfProps {
  productId: string;
  productName: string;
  productState: string;
  currentStock: number;
  maxStock: number;
  onRestockSuccess: (product: IProduct) => void;
  onClose: () => void;
}

export function RestockShelf({
  productId,
  productName,
  productState,
  currentStock,
  maxStock,
  onRestockSuccess,
  onClose,
}: RestockShelfProps) {
  const [newQuantity, setNewQuantity] = useState<number>(0);

  const handleRestock = async () => {
    // if (newQuantity > 0 && newQuantity <= maxStock - currentStock) {
    console.log({ newQuantity });

    if (newQuantity > 0 && newQuantity <= 400) {
      const res = await restock(productId, { stock: newQuantity });
      console.log({ res });
      onRestockSuccess(res?.data.data);
      onClose();
    }
  };

  let stockStatus = "";
  let statusClass = "";
  let stockNumberColor = "";
  let statusIcon = null;

  if (productState === "out") {
    stockStatus = "Out of stock";
    statusClass = "bg-primaryRed text-white";
    stockNumberColor = "text-primaryRed";
    statusIcon = (
      <Icon
        icon="fluent-mdl2:error-badge"
        width="17"
        height="17"
        className="mr-1.5"
      />
    );
  } else if (productState === "low") {
    stockStatus = "Low of stock";
    statusClass = "bg-[#FF8714] text-white";
    stockNumberColor = "text-[#FF8714]";
    statusIcon = (
      <Icon icon="si:warning-line" width="17" height="17" className="mr-1.5" />
    );
  } else {
    stockStatus = "Available";
    statusClass = "bg-[#24A855] text-white";
    stockNumberColor = "text-black";
    statusIcon = (
      <Icon
        icon="fluent:presence-available-16-filled"
        width="16"
        height="16"
        className="mr-1.5"
      />
    );
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md ">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl font-medium">
            <Icon
              icon="dashicons:update"
              width="23"
              height="23"
              className="mr-[6px]"
            />
            Restock &quot; <span className="font-semibold">{productName} </span>{" "}
            &quot;
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-5 mb-5 text-lg">
          <div className="flex items-center justify-between">
            <p className="text-grayColor font-semibold">
              Current Stock:{" "}
              <span className={stockNumberColor}>{currentStock} pcs</span>
              <span className="text-[#989797]"> / {maxStock}</span>
            </p>
            <span
              className={`flex items-center justify-between px-3 py-2 rounded-[10px] font-semibold ${statusClass}`}
            >
              {statusIcon} {stockStatus}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="new-quantity"
              className="text-grayColor font-semibold text-left text-lg"
            >
              New Quantity
            </Label>
            <Input
              id="new-quantity"
              type="number"
              className="mt-4 w-full"
              value={newQuantity}
              onChange={(e) => setNewQuantity(Number(e.target.value))}
              placeholder="enter new quantity"
            />
          </div>
          {/* <Input
                        type="number"
                        placeholder="enter new quantity"
                        value={newQuantity}
                        onChange={(e) => setNewQuantity(Number(e.target.value))}
                        className="mt-4 w-full"
                    /> */}
        </div>
        <div className="w-full flex justify-between gap-3 mb-8 ">
          <Button
            onClick={onClose}
            className="mr-2 w-1/2 text-lg text-grayColor border border-[#D8DADC] bg-[#F8F8F8] rounded-[10px] font-semibold"
          >
            Cancel
          </Button>
          <Button
            onClick={handleRestock}
            className="bg-primaryRed text-lg text-white px-4 py-2 rounded-[10px] w-1/2 font-semibold"
          >
            Restock
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
