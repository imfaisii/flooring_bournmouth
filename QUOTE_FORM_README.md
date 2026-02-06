# Quote Form - Implementation Guide

## 🎨 **Beautiful Quote Form Created**

A stunning, fully-functional quote request form matching your dark theme with accent gold highlights.

---

## 📍 **Access the Form**

**Live URL:** `http://localhost:3000/quote`

**Navigation:**
- Top navigation bar → "Get Quote" link
- Homepage CTA buttons → "Request a Free Quote"
- Mobile menu → "Get Quote"

---

## ✨ **Features**

### **Form Fields**
1. ✅ **Name** - Full name validation (min 2 chars)
2. ✅ **Email** - Email format validation
3. ✅ **Phone** - Phone number validation (min 10 chars)
4. ✅ **Address** - Property address validation (min 5 chars)
5. ✅ **Service Type** - Dropdown with all flooring services
6. ✅ **Message** - Optional additional details

### **Visual Design**
- 🌙 Dark theme with `#E6AA68` accent gold
- ✨ Glow effects and decorative backgrounds
- 📱 Fully responsive (mobile → desktop)
- 🎯 Loading states & animations
- ✅ Form validation with error messages
- 🎉 Success toasts via Sonner

### **Backend Integration**
- 💾 **MongoDB** - Saves all quote requests to database
- 📧 **Resend API** - Sends beautiful HTML email notifications
- ✅ **Zod validation** - Server-side validation
- 🔒 **Error handling** - Graceful failures

---

## 📧 **Email Integration**

### **Current Setup**
- Uses **Resend API** with key from `.env.local`
- Sender: `onboarding@resend.dev` (Resend test domain)
- Recipient: Company email from `siteConfig`

### **Email Template**
Beautiful HTML email with:
- Company branding colors
- Customer details table
- Quote ID reference
- Responsive design

### **To Use Your Own Domain**
1. Add your domain to Resend dashboard
2. Update sender in `src/app/api/quote/route.ts`:
   ```typescript
   from: "Flooring Bournemouth <quotes@yourdomain.com>"
   ```

---

## 🗄️ **Database Model**

**Collection:** `quotes`

**Schema:**
```typescript
{
  name: string,
  email: string,
  phone: string,
  address: string,
  service: string,
  message?: string,
  status: "pending" | "contacted" | "quoted" | "accepted" | "declined",
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 **Key Files**

| File | Purpose |
|------|---------|
| `/quote` page | [src/app/(marketing)/quote/page.tsx](src/app/(marketing)/quote/page.tsx) |
| Quote form component | [src/components/sections/QuoteForm.tsx](src/components/sections/QuoteForm.tsx) |
| API endpoint | [src/app/api/quote/route.ts](src/app/api/quote/route.ts) |
| Validation schema | [src/lib/validators/quote.schema.ts](src/lib/validators/quote.schema.ts) |
| Database model | [src/lib/models/Quote.ts](src/lib/models/Quote.ts) |

---

## 🧪 **Testing the Form**

### **1. Visual Test**
Visit: `http://localhost:3000/quote`

### **2. Form Submission Test**
Fill in:
- **Name:** John Smith
- **Email:** john@test.com
- **Phone:** 01202 123 456
- **Address:** 123 Test Street, Bournemouth, BH1 1AA
- **Service:** Hardwood Flooring
- **Message:** I need a quote for my living room

Click "Request Free Quote"

### **3. Check Results**

**Database:**
```bash
# Connect to MongoDB and check
use flooring-bournemouth
db.quotes.find().pretty()
```

**Email:**
- Check your inbox at the email configured in `siteConfig.company.email`
- Email will come from Resend with all customer details

**Success Toast:**
- Green toast notification appears
- Form resets after successful submission

---

## 🎨 **Customization**

### **Change Colors**
Edit: `src/app/globals.css`
```css
--color-accent: #E6AA68;  /* Main accent gold */
--color-glow: #FF9900;     /* Intense glow */
```

### **Change Email Template**
Edit: `src/app/api/quote/route.ts` (line ~45)
- Modify HTML structure
- Update styling
- Add company logo

### **Add More Fields**
1. Update schema: `src/lib/validators/quote.schema.ts`
2. Add field to form: `src/components/sections/QuoteForm.tsx`
3. Update model: `src/lib/models/Quote.ts`
4. Update email template: `src/app/api/quote/route.ts`

---

## 🚀 **Production Setup**

### **1. Resend**
- Sign up: https://resend.com
- Verify your domain
- Add API key to production `.env`

### **2. MongoDB**
- Production MongoDB URI in `.env`
- Create indexes for better performance

### **3. Email Recipient**
- Update `siteConfig.company.email` to real email
- Test email delivery

---

## 📱 **Responsive Breakpoints**

- **Mobile:** `< 768px` - Stacked layout
- **Tablet:** `768px - 1024px` - Sidebar stacks below
- **Desktop:** `> 1024px` - Side-by-side layout

---

## 🔐 **Security**

- ✅ Server-side validation (Zod)
- ✅ Client-side validation
- ✅ Environment variables for sensitive keys
- ✅ No API keys exposed to client
- ⚠️ Add rate limiting in production (TODO)
- ⚠️ Add CAPTCHA to prevent spam (TODO)

---

## 💡 **Tips**

1. **Test email delivery** - Use Resend test mode first
2. **Monitor submissions** - Check MongoDB regularly
3. **Response time** - Aim to reply within 24 hours
4. **Follow up** - Update quote status in database
5. **Admin panel** - Use `/admin` to view submissions (mock data currently)

---

## 🎉 **You're All Set!**

The quote form is **fully functional** and ready to receive customer inquiries!

**Test it now:** http://localhost:3000/quote
