import { useState } from 'react';
import { Copy, Check, MessageCircle, Facebook, Instagram, Mail } from 'lucide-react';

const marketingTemplates = {
  english: [
    {
      title: "Professional Invitation",
      platform: "WhatsApp",
      text: "🚀 Exciting Opportunity Alert!\n\nHey! I've discovered an amazing platform where you can earn daily by completing simple tasks and building your team.\n\n💰 Earn KES 100 daily from tasks\n👥 Get commissions from your team\n✅ One-time activation: KES 500\n\nJoin me today: [LINK]\n\nLet's grow together! 🌟"
    },
    {
      title: "Success Story",
      platform: "Facebook",
      text: "I never believed in online earning until I joined SmartPay! 🎉\n\nIn just 2 weeks:\n✅ Earned KES 3,500\n✅ Built a team of 15 people\n✅ Learned valuable marketing skills\n\nThis is REAL and it WORKS!\n\nReady to start your journey? Click here: [LINK]\n\n#SmartPay #OnlineEarning #FinancialFreedom"
    },
    {
      title: "Urgency Post",
      platform: "TikTok",
      text: "⚡ LIMITED SPOTS AVAILABLE! ⚡\n\nDon't miss out on this opportunity to:\n💵 Earn daily income\n📈 Build passive income streams\n🎯 Achieve financial goals\n\nOnly KES 500 to start!\n\nLink in bio 👆\n\n#MakeMoneyOnline #Kenya #SideHustle"
    }
  ],
  kiswahili: [
    {
      title: "Mwaliko wa Kirafiki",
      platform: "WhatsApp",
      text: "🌟 Habari Njema Sana!\n\nNimepata njia nzuri ya kupata pesa kila siku kwa kufanya kazi rahisi na kujenga timu.\n\n💰 Pata KES 100 kila siku\n👥 Pata commission kutoka kwa timu yako\n✅ Malipo ya mara moja: KES 500\n\nJiunge nami leo: [LINK]\n\nTuendelee pamoja! 🚀"
    },
    {
      title: "Hadithi ya Mafanikio",
      platform: "Facebook",
      text: "Sikuamini mpaka nilipojaribu! 🎊\n\nKatika wiki 2 tu:\n✅ Nimepata KES 3,500\n✅ Nina timu ya watu 15\n✅ Nimejifunza ujuzi wa biashara\n\nHii ni HALISI na INAFANYA KAZI!\n\nUko tayari kuanza? Bonyeza hapa: [LINK]\n\n#SmartPay #PesaMtandaoni #Kenya"
    }
  ],
  sheng: [
    {
      title: "Msee Invitation",
      platform: "WhatsApp",
      text: "Niaje bro! 🔥\n\nNimepata deal poa sana ya kupata munde kila day. Ni simple tu:\n\n💵 Pata KES 100 daily\n👥 Lete wasee wengine upate commission\n✅ Activation ni KES 500 tu\n\nIngia hapa msee: [LINK]\n\nTu-make hii mullah pamoja! 💪"
    },
    {
      title: "Success Flex",
      platform: "Instagram",
      text: "Msee sikuwa naexpect hii! 😱\n\nWiki 2 tu:\n✅ Nime-make KES 3,500\n✅ Team yangu ni 15 wasee\n✅ Nime-learn vitu mob\n\nHii game ni real bana! 🎯\n\nKam tu-hustle pamoja: [LINK]\n\n#SmartPay #HustleKE #MakeItHappen"
    }
  ],
  mixed: [
    {
      title: "Mixed Appeal",
      platform: "WhatsApp Status",
      text: "Guys! 🚀 Nimepata opportunity poa sana!\n\nYou can earn KES 100 daily na pia pata commission from your team. Activation ni KES 500 tu.\n\nHii ni legit, sio scam! Mimi nime-try na inafanya kazi. 💯\n\nJoin using my link: [LINK]\n\nLet's make this money together! 💰"
    },
    {
      title: "Testimonial Mix",
      platform: "Facebook",
      text: "Real talk! 💯\n\nNiliskia kuhusu SmartPay from my friend, nikaona ni poa ku-try. Sasa after wiki 2:\n\n✅ Earned KES 3,500\n✅ Team yangu iko 15 people\n✅ Daily income inacome through\n\nThis is the real deal msee! No cap! 🔥\n\nKam tu-hustle: [LINK]\n\n#SmartPay #KenyanYouth #OnlineHustle"
    }
  ]
};

export const MarketingHubPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'kiswahili' | 'sheng' | 'mixed'>('english');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text.replace('[LINK]', window.location.origin + '?ref=YOUR_ID'));
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'whatsapp':
        return <MessageCircle className="w-5 h-5" />;
      case 'facebook':
        return <Facebook className="w-5 h-5" />;
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
      default:
        return <Mail className="w-5 h-5" />;
    }
  };

  const templates = marketingTemplates[selectedLanguage];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Marketing Templates Hub 📢</h1>
        <p className="text-purple-100 text-lg">
          Ready-to-use templates in multiple languages to help you recruit faster!
        </p>
      </div>

      {/* Language Selector */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Select Language</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'english', label: 'English 🇬🇧', desc: 'Professional' },
            { key: 'kiswahili', label: 'Kiswahili 🇰🇪', desc: 'Swahili' },
            { key: 'sheng', label: "Sheng' 🔥", desc: 'Street' },
            { key: 'mixed', label: 'Mixed 🌍', desc: 'Combo' }
          ].map((lang) => (
            <button
              key={lang.key}
              onClick={() => setSelectedLanguage(lang.key as any)}
              className={`p-4 rounded-xl border-2 transition ${
                selectedLanguage === lang.key
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-slate-200 hover:border-purple-300'
              }`}
            >
              <p className="font-bold text-lg mb-1">{lang.label}</p>
              <p className="text-sm text-slate-600">{lang.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getPlatformIcon(template.platform)}
                <h3 className="font-bold text-lg text-slate-900">{template.title}</h3>
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                {template.platform}
              </span>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 mb-4 min-h-[200px]">
              <p className="text-sm text-slate-700 whitespace-pre-line">{template.text}</p>
            </div>
            
            <button
              onClick={() => copyToClipboard(template.text, index)}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2"
            >
              {copiedIndex === index ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>Copy Template</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg p-6 border-2 border-yellow-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">💡 Pro Marketing Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TipCard
            number="1"
            title="Personalize Your Message"
            description="Always add a personal touch. Mention the person's name and why you think they'd be perfect for this opportunity."
          />
          <TipCard
            number="2"
            title="Use Emojis Wisely"
            description="Emojis grab attention but don't overdo it. 2-3 per message is perfect for maintaining professionalism."
          />
          <TipCard
            number="3"
            title="Post Consistently"
            description="Share on WhatsApp status 2-3 times daily, Facebook once daily, and TikTok 1-2 times daily for best results."
          />
          <TipCard
            number="4"
            title="Follow Up"
            description="If someone shows interest, follow up within 24 hours. Quick response = higher conversion rate."
          />
        </div>
      </div>
    </div>
  );
};

const TipCard = ({ number, title, description }: any) => (
  <div className="bg-white rounded-lg p-4 border-2 border-yellow-300">
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="font-bold text-white">{number}</span>
      </div>
      <div>
        <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </div>
  </div>
);
