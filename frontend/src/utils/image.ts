export function parseImages(images: any, fallback: string): string {
  if (Array.isArray(images) && images.length > 0) return images[0];
  if (typeof images === 'string' && images.length > 0) {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : images;
    } catch {
      return images;
    }
  }
  return fallback;
}

export function getManufacturerImages(name: string): { logo: string; banner: string } {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes("artisan") || lowercaseName.includes("amit")) {
    return {
      logo: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=150&h=150",
      banner: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200&h=400"
    };
  }
  if (lowercaseName.includes("silver") || lowercaseName.includes("desai") || lowercaseName.includes("meera")) {
    return {
      logo: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=150&h=150",
      banner: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200&h=400"
    };
  }
  if (lowercaseName.includes("golden") || lowercaseName.includes("craft") || lowercaseName.includes("rajesh")) {
    return {
      logo: "https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?auto=format&fit=crop&q=80&w=150&h=150",
      banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200&h=400"
    };
  }
  return {
    logo: "https://images.unsplash.com/photo-1556761175-b813f57a32f6?auto=format&fit=crop&q=80&w=150&h=150",
    banner: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200&h=400"
  };
}
