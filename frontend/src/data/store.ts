import { orders as seedOrders, requirements as seedRequirements } from "./mock";

const keys = {
  requirements: "sbs.requirements",
  orders: "sbs.orders",
  selectedQuote: "sbs.selectedQuote",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getRequirements() {
  return read(keys.requirements, seedRequirements);
}

export function addRequirement(requirement: typeof seedRequirements[number]) {
  const next = [requirement, ...getRequirements()];
  write(keys.requirements, next);
  return next;
}

export function getOrders() {
  return read(keys.orders, seedOrders);
}

export function addOrder(order: typeof seedOrders[number]) {
  const next = [order, ...getOrders()];
  write(keys.orders, next);
  return next;
}

export function saveSelectedQuote(quote: unknown) {
  write(keys.selectedQuote, quote);
}

export function getSelectedQuote<T>() {
  return read<T | null>(keys.selectedQuote, null);
}
