import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Button,
} from "@heroui/react";

export default function AttractionSlider({ disclosure, attraction, isLoading }) {
  return (
    <Drawer isOpen={disclosure.isOpen} onOpenChange={disclosure.onOpenChange}>
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader>
              {attraction?.name || "No attraction selected"}
            </DrawerHeader>
            <DrawerBody>
              {attraction && <p>{JSON.stringify(attraction)}</p>}
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
