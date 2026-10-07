export type NewsletterSubscriber = {
  id: string;
  email: string;
  name: string;
  subscribedAt: string;
  isActive: boolean;
};

const STORAGE_KEY = "three-knocks-newsletter-subscribers";

export function getNewsletterSubscribers(): NewsletterSubscriber[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as NewsletterSubscriber[]) : [];
  } catch {
    return [];
  }
}

export function subscribeToNewsletter(email: string, name: string): { success: boolean; message: string } {
  if (typeof window === "undefined") {
    return { success: false, message: "Must be called from browser" };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { success: false, message: "Invalid email address" };
  }

  try {
    const subscribers = getNewsletterSubscribers();
    
    // Check if already subscribed
    const existingIndex = subscribers.findIndex((s) => s.email.toLowerCase() === email.toLowerCase());
    if (existingIndex !== -1) {
      // Reactivate if was unsubscribed
      subscribers[existingIndex].isActive = true;
      subscribers[existingIndex].subscribedAt = new Date().toISOString();
    } else {
      // Add new subscriber
      subscribers.push({
        id: `${Date.now()}-${Math.random()}`,
        email: email.trim(),
        name: name.trim(),
        subscribedAt: new Date().toISOString(),
        isActive: true,
      });
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(subscribers));
    return { success: true, message: "Successfully subscribed to newsletter!" };
  } catch (error) {
    return { success: false, message: "Failed to subscribe" };
  }
}

export function unsubscribeFromNewsletter(email: string): { success: boolean; message: string } {
  if (typeof window === "undefined") {
    return { success: false, message: "Must be called from browser" };
  }

  try {
    const subscribers = getNewsletterSubscribers();
    const index = subscribers.findIndex((s) => s.email.toLowerCase() === email.toLowerCase());
    
    if (index === -1) {
      return { success: false, message: "Email not found" };
    }

    subscribers[index].isActive = false;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(subscribers));
    return { success: true, message: "Unsubscribed from newsletter" };
  } catch (error) {
    return { success: false, message: "Failed to unsubscribe" };
  }
}
