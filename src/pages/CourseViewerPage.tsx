import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle, Clock, BookOpen, Target } from 'lucide-react';

interface CourseViewerPageProps {
  courseId: string;
  lessonId: string;
  onBack: () => void;
  onComplete: (courseId: string, lessonId: string) => void;
}

export const CourseViewerPage = ({ courseId, lessonId, onBack, onComplete }: CourseViewerPageProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const lessons = {
    'facebook-ads-1': {
      title: 'Facebook Business Manager Setup - Complete Guide',
      duration: '15 min',
      content: `
# 🚀 Facebook Business Manager Setup - Your Gateway to Professional Advertising

## Why Facebook Business Manager is Essential for Success

Facebook Business Manager isn't just another tool—it's your **command center** for building a profitable online business. Think of it as your digital headquarters where you'll manage millions of shillings in advertising spend, build your brand, and scale your income to levels you've only dreamed of.

### The Power of Professional Setup
When you set up Business Manager correctly, you're not just creating an account—you're laying the foundation for:
- **Unlimited earning potential** through targeted advertising
- **Professional credibility** that builds customer trust
- **Advanced tools** that give you unfair advantages over competitors
- **Team collaboration** features for when you scale your business
- **Detailed analytics** that show you exactly where your money comes from

## Step-by-Step Business Manager Creation

### Phase 1: Foundation Setup (5 minutes)

**Step 1: Navigate to business.facebook.com**
- Open a new browser tab (use Chrome or Firefox for best results)
- Type: business.facebook.com
- Click "Create Account" - this is where your journey to financial freedom begins

**Step 2: Business Information Entry**
- **Business Name**: Use your REAL business name or your personal name + "Digital Marketing"
- **Your Name**: Your full legal name (Facebook verifies this)
- **Business Email**: Create a professional email like yourname@gmail.com or use your existing business email
- **Business Address**: Your real address (required for verification)

**Pro Tip**: Never use fake information. Facebook's AI can detect inconsistencies and will ban your account, losing you thousands in potential earnings.

### Phase 2: Page Integration (3 minutes)

**Step 3: Add Your Facebook Page**
- In Business Settings, locate "Pages" in the left sidebar
- Click "Add" then "Add a Page"
- If you don't have a page yet, create one now:
  - Choose "Business or Brand"
  - Name it after your service (e.g., "John's Digital Marketing Solutions")
  - Add a professional profile picture and cover photo
  - Write a compelling description of what you offer

**Step 4: Page Optimization for Maximum Impact**
Your page is your digital storefront. Make it irresistible:
- **Profile Picture**: Use a high-quality headshot or logo
- **Cover Photo**: Show your results, testimonials, or value proposition
- **About Section**: Clearly state what you do and how you help people
- **Contact Information**: Make it easy for customers to reach you
- **Call-to-Action Button**: Use "Contact Us" or "Learn More"

### Phase 3: Ad Account Setup (4 minutes)

**Step 5: Create Your Ad Account**
- Navigate to "Ad Accounts" in Business Settings
- Click "Add" → "Create a New Ad Account"
- **Account Name**: Use something descriptive like "Main Advertising Account"
- **Time Zone**: Select "Africa/Nairobi" for Kenya
- **Currency**: Choose "KES (Kenyan Shilling)"
- **Payment Method**: We'll set this up next

**Step 6: Payment Method Configuration**
This is crucial - your payment method determines your advertising limits:

**For M-PESA Users:**
- Click "Add Payment Method"
- Select "Mobile Money" if available, or "Debit Card"
- For M-PESA: Use your registered phone number
- Verify with the OTP sent to your phone

**For Bank Card Users:**
- Enter your card details exactly as they appear on your card
- Use your real billing address
- Facebook will charge a small verification amount (usually KES 50-100)

**Pro Strategy**: Start with a small daily budget (KES 500-1000) until you prove your campaigns work, then scale up rapidly.

### Phase 4: Advanced Configuration (3 minutes)

**Step 7: Business Verification**
- Upload a business document (certificate of incorporation, business permit, or tax pin certificate)
- If you don't have business documents, use a utility bill with your name and address
- Verification usually takes 1-3 business days
- Verified accounts get higher spending limits and more features

**Step 8: Team Member Addition (Optional but Recommended)**
- Add trusted team members or virtual assistants
- Assign specific roles:
  - **Admin**: Full access (only for you)
  - **Advertiser**: Can create and manage ads
  - **Analyst**: Can view reports only
- Never give admin access to freelancers or VAs

## Security Best Practices That Protect Your Investment

### Two-Factor Authentication Setup
- Go to Security Settings
- Enable 2FA using your phone number
- Download backup codes and store them safely
- This prevents hackers from stealing your ad accounts (happens more often than you think)

### Account Recovery Preparation
- Add multiple email addresses
- Verify your phone number
- Set up trusted contacts
- Create a recovery plan document with all your account details

## Common Mistakes That Cost You Money

### ❌ Mistake 1: Using Personal Profiles for Business
**Cost**: Account bans, lost ad spend, damaged reputation
**Solution**: Always use Business Manager for any commercial activity

### ❌ Mistake 2: Fake Information
**Cost**: Permanent bans, inability to advertise, legal issues
**Solution**: Use 100% accurate information, even if you're just starting

### ❌ Mistake 3: Ignoring Verification
**Cost**: Low spending limits, restricted features, account suspensions
**Solution**: Complete verification immediately, even if it takes extra effort

### ❌ Mistake 4: Poor Payment Method Setup
**Cost**: Failed ads, missed opportunities, account restrictions
**Solution**: Use reliable payment methods with sufficient funds

## Advanced Tips for Kenyan Entrepreneurs

### Leveraging Local Advantages
- Use Kenyan phone numbers for better local ad delivery
- Target Kenyan audiences first (they convert better for local businesses)
- Use Swahili in your page content to connect with local customers
- Partner with local influencers for social proof

### Scaling Strategies
- Start with one ad account, add more as you grow
- Create separate pages for different business verticals
- Use Business Manager's collaboration tools to work with team members
- Set up automated rules to optimize your campaigns

## What Happens After Setup

Once your Business Manager is properly configured, you'll have access to:
- **Facebook Ads Manager**: Create campaigns that generate leads and sales
- **Facebook Analytics**: Deep insights into your audience behavior
- **Creative Hub**: Tools to create professional ad content
- **Brand Safety Tools**: Protect your brand reputation
- **Advanced Targeting**: Reach exactly the right customers

## Your Next Steps to Profit

1. **Complete this setup today** - don't delay, every day you wait is money lost
2. **Create your first ad campaign** with a small budget (KES 1,000)
3. **Test different audiences** to find your most profitable customers
4. **Scale successful campaigns** by increasing budgets gradually
5. **Reinvest profits** into more advertising for exponential growth

## Success Story: From Setup to KES 100,000/Month

*"I followed this exact setup process in January 2024. By March, I was spending KES 10,000/day on ads and generating KES 50,000/day in revenue. Today, my business generates over KES 100,000 monthly profit, all because I took the time to set up Business Manager correctly from day one."* - Sarah M., Nairobi

## Troubleshooting Common Issues

**Issue**: Can't verify payment method
**Solution**: Contact your bank to enable international transactions, or use a different card

**Issue**: Business verification rejected
**Solution**: Ensure documents are clear, recent (within 6 months), and match your registered information

**Issue**: Can't add team members
**Solution**: Complete business verification first, then try again

**Issue**: Low spending limits
**Solution**: Run successful campaigns consistently, spending limits increase automatically

Remember: This setup is your foundation for financial freedom. Take it seriously, follow every step, and you'll have a professional advertising platform that can generate life-changing income.

The difference between successful entrepreneurs and those who struggle is often just proper setup and execution. You now have the knowledge—take action today!
      `
    },
    'facebook-ads-2': {
      title: 'High-Converting Ad Copy Mastery',
      duration: '20 min',
      content: `
# 💰 High-Converting Ad Copy Mastery - The Psychology of Persuasion

## The Million-Shilling Secret: Why Ad Copy Determines Your Success

Your ad copy isn't just words on a screen—it's your **digital salesperson** working 24/7 to bring you customers and cash. The difference between ad copy that makes you KES 1,000/day and copy that makes you KES 50,000/day often comes down to understanding human psychology and applying proven formulas.

### The Harsh Reality of Bad Copy
- 95% of Facebook ads fail because of poor copy
- Most entrepreneurs lose money because they write ads like they're talking to friends
- Professional copywriters charge KES 100,000+ per campaign because they understand these secrets
- One word change can double your conversion rate (I'll show you examples)

## The AIDA Formula - Your Blueprint for Profit

AIDA isn't just a formula—it's a psychological journey that guides your prospects from strangers to paying customers.

### A - ATTENTION (The Hook That Stops the Scroll)

Your first 3 words determine if someone reads your ad or scrolls past. In a world where people see 5,000+ ads daily, you need to be SHOCKING, INTRIGUING, or BENEFICIAL immediately.

**Attention-Grabbing Formulas:**

**1. The Pattern Interrupt**
- "STOP SCROLLING! 🛑"
- "WARNING: Don't read this if..."
- "URGENT: Only 24 hours left..."
- "BREAKING: New discovery in..."

**2. The Curiosity Gap**
- "The weird trick that..."
- "What nobody tells you about..."
- "The secret that [industry] doesn't want you to know..."
- "Why successful people never..."

**3. The Direct Benefit**
- "Earn KES 50,000 this month..."
- "Lose 10kg in 30 days..."
- "Get 1000 followers by Friday..."
- "Double your income without..."

**4. The Question Hook**
- "Are you tired of being broke?"
- "What if I told you there's a way to..."
- "Do you want to know how I..."
- "Ready to change your life?"

### I - INTEREST (Building Desire Through Problems and Solutions)

Once you have attention, you must immediately connect with their pain points and desires. People buy solutions to problems, not products.

**Interest-Building Strategies:**

**1. Problem Agitation**
- Identify their biggest frustration
- Make them feel the pain of their current situation
- Show them what they're missing out on
- Create urgency around solving the problem

**Example**: 
"Working 9-5 but still struggling to pay rent? Watching your friends succeed while you're stuck in the same cycle? Missing out on family time because you're always working but never earning enough?"

**2. Dream Outcome Visualization**
- Paint a picture of their ideal life
- Use specific, tangible benefits
- Include emotional rewards, not just logical ones
- Make it feel achievable and real

**Example**:
"Imagine waking up to M-PESA notifications showing KES 10,000 earned while you slept. Picture telling your boss you're quitting because your online business now pays you more in a week than your job pays in a month."

### D - DESIRE (Making Them Want It NOW)

Desire is created through social proof, scarcity, and showing transformation stories that your prospects can relate to.

**Desire-Building Elements:**

**1. Social Proof That Converts**
- "Join 15,000+ Kenyans already earning..."
- "Featured in Nation Media and Standard..."
- "Recommended by [credible authority]..."
- "5-star rating from 2,847 customers..."

**2. Transformation Stories**
- Before and after scenarios
- Specific numbers and timeframes
- Relatable starting points
- Emotional transformation, not just financial

**3. Scarcity and Urgency**
- Limited spots available
- Price increases soon
- Bonus expires
- Seasonal opportunities

### A - ACTION (The CTA That Converts)

Your call-to-action determines whether interested prospects become paying customers. Weak CTAs kill conversions.

**High-Converting CTA Formulas:**

**1. Benefit-Driven CTAs**
- "Start Earning Today - Click Here"
- "Get Your First KES 5,000 This Week"
- "Claim Your Spot Before It's Gone"
- "Download Your Profit Blueprint Now"

**2. Low-Commitment CTAs**
- "Learn More (Free Info)"
- "See How It Works"
- "Watch the Training Video"
- "Get Details Here"

**3. Urgency CTAs**
- "Claim Your Spot NOW"
- "Don't Miss Out - Act Fast"
- "Last Chance - Click Here"
- "Limited Time - Start Today"

## Proven Ad Copy Templates That Generate Millions

### Template 1: The Problem-Solution Formula
```
[ATTENTION HOOK]
Are you tired of [SPECIFIC PROBLEM]?

[PROBLEM AGITATION]
Every day you wait, you're losing [SPECIFIC LOSS]. While others are [ACHIEVING DESIRED OUTCOME], you're still [STUCK IN CURRENT SITUATION].

[SOLUTION INTRODUCTION]
What if I told you there's a proven system that helps [TARGET AUDIENCE] [ACHIEVE SPECIFIC RESULT] in just [TIMEFRAME]?

[SOCIAL PROOF]
Over [NUMBER] people have already used this system to [SPECIFIC RESULTS].

[CALL TO ACTION]
Click "Learn More" to discover how you can [BENEFIT] starting today.
```

### Template 2: The Success Story Formula
```
[ATTENTION HOOK]
From [STARTING POINT] to [END RESULT] in [TIMEFRAME]

[STORY BEGINNING]
[TIME PERIOD] ago, [PERSON] was [STRUGGLING SITUATION]. They tried [FAILED ATTEMPTS] but nothing worked.

[TURNING POINT]
Then they discovered [YOUR SOLUTION] and everything changed.

[RESULTS]
Today, [PERSON] [SPECIFIC ACHIEVEMENTS]. They went from [BEFORE] to [AFTER].

[SOCIAL PROOF]
[PERSON] is just one of [NUMBER] success stories.

[CALL TO ACTION]
Ready to write your own success story? Click here to start.
```

### Template 3: The Urgency Formula
```
[ATTENTION HOOK]
⚡ URGENT: Only [NUMBER] spots left!

[OPPORTUNITY]
For the first time ever, we're opening [EXCLUSIVE OPPORTUNITY] to [TARGET AUDIENCE].

[BENEFITS]
This means you can [LIST 3-5 SPECIFIC BENEFITS] without [COMMON OBSTACLES].

[SCARCITY]
But here's the catch: We can only accept [NUMBER] people because [LOGICAL REASON].

[SOCIAL PROOF]
The last time we did this, all spots filled in [TIMEFRAME] and participants [ACHIEVED RESULTS].

[CALL TO ACTION]
Don't miss out. Secure your spot now before it's too late.
```

## Power Words That Trigger Buying Decisions

### Emotional Triggers
- **Free** (most powerful word in marketing)
- **New** (humans crave novelty)
- **Proven** (reduces risk perception)
- **Guaranteed** (eliminates fear)
- **Secret** (creates curiosity)
- **Exclusive** (makes them feel special)
- **Limited** (creates urgency)
- **Now** (encourages immediate action)

### Authority Words
- **Experts** agree...
- **Studies** show...
- **Research** proves...
- **Scientists** discovered...
- **Doctors** recommend...

### Benefit Words
- **Easy** (removes effort barrier)
- **Fast** (saves time)
- **Simple** (reduces complexity)
- **Automatic** (removes work)
- **Instant** (immediate gratification)

## Advanced Psychological Triggers

### 1. Loss Aversion
People fear losing more than they desire gaining. Use phrases like:
- "Don't let this opportunity slip away"
- "What you'll miss if you don't act now"
- "The cost of doing nothing"

### 2. Social Proof
Humans follow the crowd. Include:
- Customer count ("Join 50,000+ users")
- Testimonials with photos and names
- Media mentions and awards
- User-generated content

### 3. Authority
People follow experts. Establish credibility with:
- Your credentials and experience
- Client results and case studies
- Media appearances and features
- Industry recognition

## Testing and Optimization Strategies

### A/B Testing Elements
1. **Headlines** - Test different attention hooks
2. **Opening lines** - Vary your problem statements
3. **CTAs** - Try different action phrases
4. **Social proof** - Test different testimonials
5. **Offers** - Experiment with bonuses and guarantees

### What to Measure
- **Click-through rate (CTR)** - How many people click your ad
- **Cost per click (CPC)** - How much each click costs
- **Conversion rate** - How many clicks become customers
- **Cost per acquisition (CPA)** - Total cost to get one customer
- **Return on ad spend (ROAS)** - Revenue generated per shilling spent

## Real Examples: Before vs After

### Example 1: E-commerce Store

**Before (Poor Performance):**
"Buy our products online. We have great deals and fast delivery. Shop now!"
*Results: 0.8% CTR, KES 45 CPC, 1.2% conversion rate*

**After (Optimized):**
"🚨 FLASH SALE: 50% OFF Everything (24 Hours Only!)
Tired of overpriced shopping? Get premium products at wholesale prices. Over 10,000 happy customers can't be wrong!
⏰ Sale ends midnight tonight - Don't miss out!
👉 Shop Now & Save Big"
*Results: 3.2% CTR, KES 18 CPC, 4.7% conversion rate*

### Example 2: Online Course

**Before:**
"Learn digital marketing with our comprehensive course. Enroll today!"
*Results: 1.1% CTR, KES 38 CPC, 2.1% conversion rate*

**After:**
"From Broke to KES 100K/Month in 90 Days 💰
Sarah was a struggling teacher earning KES 25K/month. Today she runs a 6-figure digital agency.
Her secret? The exact system we teach in our Digital Marketing Masterclass.
🎯 Over 5,000 students, 94% success rate
⚡ Limited spots: Only 50 students per cohort
🎁 Bonus: Free 1-on-1 coaching session
Ready to transform your life? Click 'Learn More' now!"
*Results: 5.8% CTR, KES 12 CPC, 8.3% conversion rate*

## Industry-Specific Copy Strategies

### For Service Businesses
- Focus on transformation and results
- Use before/after case studies
- Emphasize expertise and experience
- Include risk reversal guarantees

### For E-commerce
- Highlight product benefits, not features
- Use urgency and scarcity
- Show social proof through reviews
- Emphasize convenience and value

### For Courses/Education
- Promise specific skills and outcomes
- Use student success stories
- Emphasize practical, actionable content
- Offer money-back guarantees

## Common Copy Mistakes That Kill Conversions

### ❌ Mistake 1: Talking About Features Instead of Benefits
**Wrong**: "Our course has 50 videos and 200 pages of content"
**Right**: "Master digital marketing in just 30 days with our step-by-step system"

### ❌ Mistake 2: Being Too Salesy
**Wrong**: "BUY NOW! BEST DEAL EVER! LIMITED TIME!"
**Right**: "Discover how 500+ entrepreneurs built profitable businesses using this simple method"

### ❌ Mistake 3: No Clear Value Proposition
**Wrong**: "We're the best marketing agency in Kenya"
**Right**: "We help small businesses get 50+ qualified leads per month using proven Facebook ad strategies"

### ❌ Mistake 4: Weak or Missing CTA
**Wrong**: "Contact us for more information"
**Right**: "Get your free marketing audit and discover 3 ways to double your leads in 30 days"

Remember: Great copy isn't about being clever or creative—it's about understanding your customer's deepest desires and fears, then presenting your solution as the bridge between their current pain and their dream outcome.

Your copy is your most valuable business asset. Invest time in mastering it, and it will pay you back for life.
      `
    }
  };

  const currentLesson = lessons[lessonId as keyof typeof lessons];

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setScrollProgress(Math.min(progress, 100));
        
        // Mark as completed when user scrolls to 95% (hidden feature)
        if (progress >= 95 && !isCompleted) {
          setIsCompleted(true);
          onComplete(courseId, lessonId);
        }
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, [courseId, lessonId, isCompleted, onComplete]);

  if (!currentLesson) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Lesson Not Found</h2>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-slate-300 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Course</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-slate-300">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{currentLesson.duration}</span>
              </div>
              {isCompleted && (
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-semibold">Completed</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Reading Progress: {Math.round(scrollProgress)}%
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Lesson Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">{currentLesson.title}</h1>
                <p className="text-blue-100 mt-2">Professional Marketing Training</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-blue-100">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{currentLesson.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Practical Implementation</span>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div
            ref={contentRef}
            className="p-8 prose prose-lg max-w-none overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 200px)' }}
          >
            <div
              className="leading-relaxed text-slate-700"
              dangerouslySetInnerHTML={{
                __html: currentLesson.content
                  .replace(/\n/g, '<br>')
                  .replace(/#{1}\s(.+)/g, '<h1 class="text-3xl font-bold text-slate-900 mt-8 mb-4">$1</h1>')
                  .replace(/#{2}\s(.+)/g, '<h2 class="text-2xl font-bold text-slate-800 mt-6 mb-3">$1</h2>')
                  .replace(/#{3}\s(.+)/g, '<h3 class="text-xl font-bold text-slate-700 mt-4 mb-2">$1</h3>')
                  .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
                  .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
                  .replace(/`(.+?)`/g, '<code class="bg-slate-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
