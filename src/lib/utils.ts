import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as clipboard from "@tauri-apps/plugin-clipboard-manager"

export function isTauri() {
  return (window as never)["__TAURI__"] !== undefined
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function copyToClipboard(text: string) {
  if (isTauri()) {
    void clipboard.writeText(text)
  } else {
    void navigator.clipboard.writeText(text)
  }
}
