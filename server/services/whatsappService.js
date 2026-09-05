// WhatsApp notification service
//
// Two ways of notifying the admin about a new order:
//
// 1. OFFICIAL API (recommended for production): if WHATSAPP_CLOUD_API_TOKEN
//    and WHATSAPP_CLOUD_PHONE_NUMBER_ID are set in the .env file, this
//    service sends the order message automatically using Meta's official
//    WhatsApp Cloud API (https://developers.facebook.com/docs/whatsapp).
//
// 2. FALLBACK (works with zero setup): if the Cloud API is not configured,
//    the service simply builds a "wa.me" link with the order message
//    pre-filled. The frontend opens this link so a staff member can review
//    and press send in WhatsApp themselves. No credentials are hardcoded.

const buildOrderMessage = (order) => {
  const restaurantName = process.env.RESTAURANT_NAME || 'the restaurant';
  const itemLines = order.items
    .map((item, idx) => `${idx + 1}. ${item.name} x${item.quantity} - ₹${item.price * item.quantity}`)
    .join('\n');

  return (
    `🍔 NEW FOOD ORDER - ${restaurantName}\n\n` +
    `Order ID: ${order.orderId}\n\n` +
    `Customer: ${order.customerName}\n` +
    `Mobile: ${order.customerPhone}\n` +
    `Delivery Type: ${order.deliveryType}\n` +
    `Address: ${order.address}\n` +
    (order.landmark ? `Landmark: ${order.landmark}\n` : '') +
    `\n---ORDER ITEMS---\n${itemLines}\n\n` +
    `Subtotal: ₹${order.subtotal}\n` +
    `Delivery Charge: ₹${order.deliveryCharge}\n` +
    `TOTAL: ₹${order.total}\n\n` +
    `Payment: ${order.paymentMethod}\n\n` +
    `Please confirm the order.`
  );
};

const buildCustomerUpdateMessage = (order, statusMessage) => {
  return `Hello ${order.customerName}, your order ${order.orderId} ${statusMessage}`;
};

const buildWhatsAppLink = (phoneNumber, message) => {
  const cleanNumber = String(phoneNumber || '').replace(/[^\d]/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
};

// Attempts to send via the official Cloud API. Returns true on success.
const sendViaCloudApi = async (toNumber, message) => {
  const token = process.env.WHATSAPP_CLOUD_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    return false; // not configured, caller should use the fallback link
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: toNumber,
          type: 'text',
          text: { body: message },
        }),
      }
    );
    return response.ok;
  } catch (error) {
    console.error('WhatsApp Cloud API error:', error.message);
    return false;
  }
};

// Notifies the admin about a new order. Always returns a wa.me fallback
// link so the frontend can offer a manual "Send via WhatsApp" button,
// even if the automatic Cloud API send succeeds.
const notifyAdminNewOrder = async (order) => {
  const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER;
  const message = buildOrderMessage(order);

  let sentAutomatically = false;
  if (adminNumber) {
    sentAutomatically = await sendViaCloudApi(adminNumber, message);
  }

  return {
    sentAutomatically,
    whatsappLink: adminNumber ? buildWhatsAppLink(adminNumber, message) : null,
    message,
  };
};

module.exports = {
  buildOrderMessage,
  buildCustomerUpdateMessage,
  buildWhatsAppLink,
  notifyAdminNewOrder,
};
