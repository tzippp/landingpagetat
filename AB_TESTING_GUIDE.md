# A/B Testing & Analytics Guide

## 🎯 Overview

Your tattoo landing page now includes comprehensive A/B testing and analytics features to track performance across different landing page variants and traffic sources.

## 📊 Enhanced Data Collection

### **A/B Testing Variants**

- **Variant A**: Default landing page
- **Variant B**: Alternative design/layout
- **Variant C**: Third option for testing

### **Traffic Sources Tracked**

- **Google Ads**: Paid search campaigns
- **Facebook**: Social media ads
- **Instagram**: Organic and paid social
- **TikTok**: Video platform traffic
- **Direct**: Direct website visits
- **Referral**: Links from other sites

## 🔧 How to Use A/B Testing

### **1. URL Parameters for Testing**

Add these parameters to your landing page URLs:

```
https://yoursite.com/?variant=A&utm_source=google&utm_campaign=summer_special
https://yoursite.com/?variant=B&utm_source=facebook&utm_campaign=summer_special
https://yoursite.com/?variant=C&utm_source=instagram&utm_campaign=summer_special
```

### **2. UTM Parameters for Campaign Tracking**

- `utm_source`: Traffic source (google, facebook, instagram, etc.)
- `utm_medium`: Marketing medium (cpc, social, email, etc.)
- `utm_campaign`: Campaign name
- `utm_content`: Specific ad content
- `utm_term`: Search keywords

### **3. Admin Panel Features**

#### **Filtering Options:**

- **Landing Page**: Filter by service type
- **Source**: Filter by traffic source
- **Variant**: Filter by A/B test variant

#### **Analytics Dashboard:**

- Total chats count
- Today's new chats
- Top performing source
- Best performing variant

#### **Enhanced Chat Display:**

- 📍 Landing page source
- 🎯 Traffic source type
- 📊 A/B test variant
- 📢 Campaign name (if available)

## 📈 Key Metrics to Track

### **Conversion Metrics:**

- Chat initiation rate by variant
- Message completion rate
- Lead quality by source
- Cost per lead by campaign

### **A/B Test Analysis:**

- Which variant gets more chats?
- Which variant has better engagement?
- Which variant converts better?

### **Source Performance:**

- Google Ads vs Facebook performance
- Organic vs paid traffic quality
- Campaign ROI analysis

## 🚀 Implementation Examples

### **Google Ads Campaign:**

```
https://yoursite.com/?variant=A&utm_source=google&utm_medium=cpc&utm_campaign=summer_tattoo_special&utm_content=variant_a&utm_term=fine+line+tattoo
```

### **Facebook Ads Campaign:**

```
https://yoursite.com/?variant=B&utm_source=facebook&utm_medium=social&utm_campaign=summer_tattoo_special&utm_content=variant_b
```

### **Instagram Organic:**

```
https://yoursite.com/?variant=C&utm_source=instagram&utm_medium=social&utm_campaign=organic_traffic
```

## 📋 Admin Panel Usage

### **1. View Analytics:**

- Go to `/admin/chats`
- See real-time analytics dashboard
- Filter by date, source, variant

### **2. Compare Performance:**

- Use filters to compare variants
- Analyze source performance
- Track campaign effectiveness

### **3. Export Data:**

- All data is stored in MongoDB
- Export for external analysis
- Use for reporting and optimization

## 🎨 Customization

### **Adding New Variants:**

1. Update `variantOptions` in `pages/admin/chats.js`
2. Add new variant logic in `pages/api/save-chat.js`
3. Test with sample data

### **Adding New Sources:**

1. Update `sourceOptions` in admin panel
2. Add source detection logic in save-chat API
3. Test with different referrers

## 🔍 Testing Your Setup

### **Create Test Data:**

```bash
# Visit this URL to create test chats
http://localhost:3000/api/create-test-chats
```

### **Test Different Scenarios:**

1. Visit with different UTM parameters
2. Test from different sources
3. Compare variant performance
4. Analyze admin panel data

## 📱 Mobile Considerations

### **Responsive Design:**

- All analytics work on mobile
- Admin panel is mobile-friendly
- Chat interface adapts to screen size

### **Mobile Tracking:**

- User agent detection
- Mobile vs desktop performance
- Touch vs click interactions

## 🎯 Best Practices

### **A/B Testing:**

- Test one variable at a time
- Run tests for at least 2 weeks
- Ensure statistical significance
- Document your hypotheses

### **Campaign Tracking:**

- Use consistent naming conventions
- Track everything from the start
- Regular performance reviews
- Optimize based on data

### **Data Analysis:**

- Look at trends over time
- Compare similar campaigns
- Focus on conversion quality
- Consider seasonality

## 🚨 Troubleshooting

### **Common Issues:**

1. **No data showing**: Check MongoDB connection
2. **Filters not working**: Verify API responses
3. **Missing variants**: Check URL parameters
4. **Source not detected**: Verify referrer headers

### **Debug Steps:**

1. Check browser console for errors
2. Verify API endpoints are working
3. Test with sample data
4. Check MongoDB for data integrity

## 📞 Support

For questions about A/B testing implementation or analytics features, refer to the code comments in:

- `pages/api/save-chat.js`
- `pages/api/get-chats.js`
- `pages/admin/chats.js`
