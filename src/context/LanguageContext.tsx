import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'am';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, defaultText?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand & General
    'brand.name': 'Abdi Aluminum & Glass',
    'brand.tagline': 'Built With Precision. Designed to Last.',
    'brand.shortDesc': 'Professional aluminum and glass fabrication, supply, and precision architectural installation for commercial and residential developments.',

    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.products': 'Products',
    'nav.services': 'Services',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    'nav.requestQuote': 'Request a Quote',
    'nav.adminPortal': 'Admin Portal',

    // Hero Section
    'hero.label': 'ALUMINUM & GLASS SOLUTIONS',
    'hero.headline': 'Built With Precision. Designed to Last.',
    'hero.subtext': 'Professional aluminum and glass fabrication, supply, and precision architectural installation for commercial, residential, and corporate developments across Ethiopia.',
    'hero.cta.quote': 'Request a Quote',
    'hero.cta.projects': 'Explore Our Projects',
    'hero.trust.specs': 'Engineered Specs',
    'hero.trust.tolerances': 'Exact Tolerances',
    'hero.trust.installation': 'Site Installation',

    // Trust Pillars
    'trust.quality.title': 'Quality Materials',
    'trust.quality.desc': 'Architectural-grade 6063 aluminum alloys, tempered safety glass, and certified EPDM weather sealing systems.',
    'trust.precision.title': 'Precision Fabrication',
    'trust.precision.desc': 'Tight miter cuts, reinforced internal corner crimping, and precision milling for flawless fit and structural rigidity.',
    'trust.installation.title': 'Professional Installation',
    'trust.installation.desc': 'Expert on-site rigging, laser-aligned fixing, and structural weatherproofing by specialized glazing technicians.',
    'trust.service.title': 'Reliable Service',
    'trust.service.desc': 'Responsive communication, clear project timelines, transparent documentation, and ongoing maintenance support.',

    // Services Section
    'services.label': 'Architectural Expertise',
    'services.title': 'Engineered Aluminum & Glass Services',
    'services.desc': 'From in-house precision fabrication to specialized site glazing, our certified architectural teams deliver turnkey solutions for complex building specifications.',
    'services.viewAll': 'View All Services',
    'services.explore': 'Explore Service Specs',
    'services.deliverables': 'Key Deliverables & Capabilities',
    'services.requestProposal': 'Request Service Proposal',
    'services.needThis': 'Need this service for your project?',
    'services.needThisDesc': 'Our estimation engineers can calculate profile schedules, structural requirements, and provide a detailed price breakdown.',

    // Projects Section
    'projects.label': 'Portfolio of Completed Works',
    'projects.title': 'Precision Architectural Installations',
    'projects.desc': 'Explore our completed commercial facades, high-end residential sliding systems, and corporate glass partition installations.',
    'projects.viewAll': 'Explore Full Portfolio',
    'projects.viewCaseStudy': 'View Case Study & Gallery',
    'projects.scope': 'Scope of Work',
    'projects.year': 'Year Completed',
    'projects.requestSimilar': 'Request Quote for Similar Scope',
    'projects.fullscreen': 'View Fullscreen Gallery',
    'projects.views': 'Detailed Views & Architectural Elevations',

    // Process Section
    'process.label': 'Workmanship & Execution',
    'process.title': 'Our 4-Stage Architectural Process',
    'process.desc': 'Every aluminum and glass project follows a rigorous, sequential quality control workflow to ensure structural integrity and enduring architectural beauty.',
    'process.step1.title': 'Consultation',
    'process.step1.subtitle': "Understand the customer's requirements",
    'process.step1.desc': 'We review architectural blueprints, elevation schedules, aesthetic preferences, and budget parameters to recommend optimal profile systems and glazing specifications.',
    'process.step2.title': 'Site Assessment',
    'process.step2.subtitle': 'Evaluate measurements and project requirements',
    'process.step2.desc': 'Our technical team visits the jobsite to verify structural openings, lintel tolerances, floor levels, deflection clearances, and installation access conditions.',
    'process.step3.title': 'Fabrication',
    'process.step3.subtitle': 'Prepare the aluminum and glass components',
    'process.step3.desc': 'Components are cut with precision miter tolerances, pneumatically crimped, fitted with hardware, and sealed in our specialized fabrication facility.',
    'process.step4.title': 'Installation',
    'process.step4.subtitle': 'Professionally install and complete the project',
    'process.step4.desc': 'Certified installers rig and fix frames plumb and true, complete structural silicone weatherproofing, test lock hardware, and conduct final handover inspections.',

    // Quote CTA Banner
    'cta.label': 'Direct Fabrication & Installation',
    'cta.title': 'Have an Architectural Drawing or Project Specification?',
    'cta.desc': 'Send us your architectural elevations, window schedules, or site measurements. Our estimators will prepare a comprehensive quotation with profile specifications, glass performance data, and lead times.',
    'cta.submit': 'Submit Quote Request',
    'cta.contact': 'Contact Office',
    'cta.directLine': 'Direct Inquiries',
    'cta.responseTime': 'Response within 24 business hours',

    // Products Page
    'products.label': 'Architectural Inventory',
    'products.title': 'Aluminum Profiles, Glazing & Engineered Systems',
    'products.desc': 'Premium-grade architectural materials and assembled units tailored for commercial facades, structural windows, and luxury interior partitions.',
    'products.searchPlaceholder': 'Search products...',
    'products.specs': 'Technical Specifications',
    'products.requestQuote': 'Request Quotation for This System',
    'products.inquire': 'Inquire With Technical Team',
    'products.related': 'Related Systems in',
    'products.back': 'Back to All Products',

    // Categories
    'cat.all': 'All',
    'cat.profiles': 'Aluminum Profiles',
    'cat.glass': 'Glass',
    'cat.doors': 'Aluminum Doors',
    'cat.windows': 'Aluminum Windows',
    'cat.glassDoors': 'Glass Doors',
    'cat.hardware': 'Accessories & Hardware',
    'cat.residential': 'Residential',
    'cat.commercial': 'Commercial',
    'cat.office': 'Office',
    'cat.storefront': 'Storefront',
    'cat.interior': 'Interior',
    'cat.custom': 'Custom Projects',

    // Quote Form Page
    'quote.label': 'Project Estimating',
    'quote.title': 'Request an Architectural Quotation',
    'quote.desc': 'Submit your project drawings, window schedules, or estimated dimensions. Our engineering estimators calculate profile specifications, glass performance values, and pricing.',
    'quote.form.title': 'Technical Project Brief',
    'quote.form.subtitle': 'All fields marked with an asterisk (*) are required for accurate estimation.',
    'quote.fullName': 'Full Name',
    'quote.phone': 'Phone Number',
    'quote.email': 'Email Address',
    'quote.projectType': 'Project Type',
    'quote.location': 'Project Location / Site Area',
    'quote.size': 'Estimated Project Size / Opening Count',
    'quote.contactMethod': 'Preferred Contact Method',
    'quote.specs': 'Project Description & Specifications',
    'quote.fileUpload': 'Optional Architectural Drawings / BoQ / Photo (PDF, DWG, PNG, JPG)',
    'quote.chooseFile': 'Choose File',
    'quote.submit': 'Submit Quote Request',
    'quote.submitting': 'Submitting Quote Request...',
    'quote.success.title': 'Thank you. Your request has been received.',
    'quote.success.desc': 'We will contact you soon. Our technical estimator is reviewing your specifications and will follow up via your preferred contact method.',
    'quote.success.submitAnother': 'Submit Another Quote Request',
    'quote.method.phone': 'Phone Call',
    'quote.method.whatsapp': 'WhatsApp Message',
    'quote.method.email': 'Email',

    // Contact Page
    'contact.label': 'Direct Communication',
    'contact.title': 'Contact Our Workshop & Technical Team',
    'contact.desc': 'Whether you have an upcoming project blueprint, an existing site requiring assessment, or architectural profile questions, we are ready to assist.',
    'contact.channels.title': 'Office & Workshop Coordinates',
    'contact.channels.desc': 'Reach out to schedule on-site measurements or visit our fabrication facility.',
    'contact.office': 'Office & Workshop',
    'contact.telephone': 'Direct Telephone',
    'contact.whatsapp': 'WhatsApp Dispatch',
    'contact.email': 'Email Inquiries',
    'contact.hours': 'Operating Hours',
    'contact.form.title': 'Send a Message',
    'contact.form.desc': 'Fill out the details below and an Abdi Aluminum & Glass representative will follow up promptly.',
    'contact.subject': 'Subject',
    'contact.message': 'Your Message',
    'contact.send': 'Send Message',
    'contact.sending': 'Sending Message...',
    'contact.success.title': 'Thank You. Your Message Has Been Sent.',
    'contact.success.desc': 'We have received your inquiry. Our team will review your message and contact you shortly.',

    // About Page
    'about.label': 'Company Profile',
    'about.title': 'Engineering Precision in Aluminum & Glass Architecture',
    'about.desc': 'Providing comprehensive fabrication, supply, and installation solutions for doors, windows, curtain walls, storefronts, and interior partitions.',
    'about.commitment': 'Our Commitment',
    'about.heading': 'Built With Precision. Engineered to Endure.',
    'about.p1': 'We specialize in high-tolerance architectural aluminum fabrication and advanced glass systems. We work closely with property developers, architects, general contractors, and homeowners to deliver robust, aesthetically refined building envelopes and interior glazing.',
    'about.p2': 'From large commercial storefronts and multi-story curtain walls to slimline residential sliding patio doors and executive acoustic office partitions, every piece that leaves our workshop is inspected for dimensional accuracy, corner rigidity, and weather sealing.',
    'about.p3': 'We believe that architectural glazing is not merely decorative; it is a critical component of building safety, acoustic comfort, and natural daylighting. That is why we maintain strict adherence to quality materials and professional installation methods.',
    'about.pillarsTitle': 'Our Operating Standards',
    'about.pillarsDesc': 'Our workshop and on-site practices are governed by six core tenets of architectural craftsmanship.',
    'about.val1.title': 'Precision Workmanship',
    'about.val1.desc': 'Accurate miter cutting, pneumatic corner crimping, and tight assembly tolerances guarantee structural stability and weather resistance.',
    'about.val2.title': 'Material Integrity',
    'about.val2.desc': 'We fabricate exclusively with certified architectural aluminum extrusions, tempered safety glass, and high-performance weather gaskets.',
    'about.val3.title': 'Custom Engineering',
    'about.val3.desc': 'Every project presents unique architectural demands. We adapt profiles, hardware, and glazing to suit specific wind loads, acoustics, and aesthetics.',
    'about.val4.title': 'Certified Installation',
    'about.val4.desc': 'Our on-site crews adhere to rigorous safety protocols and manufacturer fastening guidelines, ensuring long-term watertight performance.',
    'about.val5.title': 'Customer Satisfaction',
    'about.val5.desc': 'Clear communication, prompt site surveys, detailed quotations, and dedicated post-installation support on every commercial or residential job.',
    'about.val6.title': 'Architectural Excellence',
    'about.val6.desc': 'Transforming architectural concepts into enduring glass and aluminum installations that enhance daylight, thermal comfort, and modern beauty.',

    // Common / UI
    'common.back': 'Back',
    'common.viewAll': 'View All',
    'common.requestQuote': 'Request a Quote',
    'common.contactUs': 'Contact Us',
    'common.loading': 'Loading data...',
    'common.noResults': 'No matching items found.',
    'common.notFound': 'Not Found',
    'common.returnHome': 'Return Home',

    // Testimonials
    'test.label': 'Client Trust & Verification',
    'test.title': 'Feedback From Site Developers & Homeowners',

    // Footer
    'footer.navigation': 'Navigation',
    'footer.capabilities': 'Core Capabilities',
    'footer.office': 'Business Office',
    'footer.proposal': 'Request Project Proposal',
    'footer.allRights': 'All rights reserved.',
    'footer.inquiries': 'Inquiries',
    'footer.getQuote': 'Get a Quote',
    'footer.admin': 'Admin Dashboard',

    // WhatsApp
    'whatsapp.chat': 'WhatsApp',
    'whatsapp.prefill': 'Hello, I would like to request information about your aluminum and glass services.'
  },

  am: {
    // Brand & General
    'brand.name': 'አብዲ አልሙኒየም እና መስታወት',
    'brand.tagline': 'በጥራት እና ጥንቃቄ የተሰሩ። ለረጅም ጊዜ የሚቆዩ።',
    'brand.shortDesc': 'ደረጃውን የጠበቀ የአልሙኒየም እና የመስታወት ፋብሪኬሽን፣ አቅርቦት እና ሙያዊ የገጠማ ስራ ለንግድ እና ለመኖሪያ ሕንፃዎች።',

    // Navigation
    'nav.home': 'ዋና ገጽ',
    'nav.about': 'ስለ እኛ',
    'nav.products': 'ምርቶች',
    'nav.services': 'አገልግሎቶች',
    'nav.projects': 'ፕሮጀክቶች',
    'nav.contact': 'አድራሻ',
    'nav.requestQuote': 'ዋጋ ይጠይቁ',
    'nav.adminPortal': 'አስተዳዳሪ',

    // Hero Section
    'hero.label': 'የአልሙኒየም እና መስታወት ስራዎች',
    'hero.headline': 'በጥራት እና ጥንቃቄ የተሰሩ። ለረጅም ጊዜ የሚቆዩ።',
    'hero.subtext': 'ለተለያዩ የንግድ ሕንፃዎች፣ መኖሪያ ቤቶች እና ቢሮዎች ደረጃቸውን የጠበቁ የአልሙኒየም እና መስታወት ፋብሪኬሽን እና የገጠማ ስራዎች በኢትዮጵያ።',
    'hero.cta.quote': 'ዋጋ ይጠይቁ',
    'hero.cta.projects': 'የተሰሩ ፕሮጀክቶችን ይመልከቱ',
    'hero.trust.specs': 'ደረጃቸውን የጠበቁ ዕቃዎች',
    'hero.trust.tolerances': 'ትክክለኛ ልኬቶች',
    'hero.trust.installation': 'የጣቢያ ገጠማ ስራ',

    // Trust Pillars
    'trust.quality.title': 'ጥራት ያላቸው ጥሬ ዕቃዎች',
    'trust.quality.desc': 'ደረጃውን የጠበቀ 6063 የአልሙኒየም ፕሮፋይል፣ ጠንካራ ቴምፐርድ መስታወት እና ጥራት ያላቸው የውሃና ንፋስ መከላከያ ማሸጊያዎች።',
    'trust.precision.title': 'ጥንቁቅ ፋብሪኬሽን',
    'trust.precision.desc': 'ትክክለኛ የማዕዘን ቁረጣ፣ ጠንካራ የመገጣጠሚያ ክሪምፒንግ እና ለረጅም ጊዜ የሚቆይ መዋቅር።',
    'trust.installation.title': 'ሙያዊ የገጠማ ስራ',
    'trust.installation.desc': 'ልምድ ባላቸው ባለሙያዎች የሚከናወን ትክክለኛ የሌዘር አሰላለፍ እና አስተማማኝ የገጠማ ስራ።',
    'trust.service.title': 'አስተማማኝ አገልግሎት',
    'trust.service.desc': 'ፈጣን ምላሽ፣ ግልጽ የስራ ጊዜ ሰሌዳ እና ቀጣይነት ያለው የድጋፍ አገልግሎት።',

    // Services Section
    'services.label': 'የላቀ የሙያ ክህሎት',
    'services.title': 'የአልሙኒየም እና መስታወት የምህንድስና አገልግሎቶች',
    'services.desc': 'በዎርክሾፓችን ውስጥ ከሚከናወነው ጥንቁቅ ፋብሪኬሽን አንስቶ እስከ ሳይት ገጠማ ድረስ የተሟላ እና አስተማማኝ አገልግሎት እንሰጣለን።',
    'services.viewAll': 'ሁሉንም አገልግሎቶች ይመልከቱ',
    'services.explore': 'ዝርዝር መግለጫዎችን ይመልከቱ',
    'services.deliverables': 'ዋና ዋና አገልግሎቶችና የስራ ወሰን',
    'services.requestProposal': 'የዋጋ ማቅረቢያ ይጠይቁ',
    'services.needThis': 'ይህንን አገልግሎት ለፕሮጀክትዎ ይፈልጋሉ?',
    'services.needThisDesc': 'የግምት ባለሙያዎቻችን የፕሮፋይል ፍላጎትን፣ መዋቅራዊ መስፈርቶችን እና ዝርዝር የዋጋ ማጠቃለያ ያዘጋጁልዎታል።',

    // Projects Section
    'projects.label': 'የተሰሩ ስራዎች ማህደር',
    'projects.title': 'ደረጃቸውን የጠበቁ የስራ ውጤቶች',
    'projects.desc': 'ያጠናቀቅናቸውን የንግድ ሕንፃ ፊት ለፊት መስታወቶች፣ ዘመናዊ የመኖሪያ ቤት ተንሸራታች በሮች እና የቢሮ መከፋፈያዎችን ይመልከቱ።',
    'projects.viewAll': 'ሁሉንም ፕሮጀክቶች ይመልከቱ',
    'projects.viewCaseStudy': 'የስራውን ዝርዝርና ፎቶዎች ይመልከቱ',
    'projects.scope': 'የስራው ወሰን',
    'projects.year': 'የተጠናቀቀበት ዓመት',
    'projects.requestSimilar': 'ተመሳሳይ ስራ ለማሰራት ዋጋ ይጠይቁ',
    'projects.fullscreen': 'ሙሉ ምስሉን ይመልከቱ',
    'projects.views': 'ዝርዝር እይታዎች እና ፎቶዎች',

    // Process Section
    'process.label': 'አሰራራችን እና አፈፃፀማችን',
    'process.title': 'የስራችን 4 ደረጃዎች',
    'process.desc': 'እያንዳንዱ ስራ ጥራቱን የጠበቀ እና ዘላቂ ጥንካሬ ያለው እንዲሆን በተደራጀ ቅደም ተከተል ይከናወናል።',
    'process.step1.title': 'ምክክር',
    'process.step1.subtitle': 'የደንበኛውን ፍላጎት በጥልቀት መረዳት',
    'process.step1.desc': 'የህንፃ ንድፎችን፣ የመስኮት ሰሌዳዎችን፣ የተመረጡ ዲዛይኖችን እና በጀትን በማየት ተስማሚ የሆነውን የፕሮፋይል እና የመስታወት ዓይነት እንመክራለን።',
    'process.step2.title': 'የቦታ ልኬት',
    'process.step2.subtitle': 'የሳይት ልኬቶችን በትክክል መውሰድ',
    'process.step2.desc': 'የቴክኒክ ባለሙያዎቻችን ሳይት ድረስ በመሄድ የቦታውን ትክክለኛ ልኬቶች እና የገጠማ ሁኔታዎችን ያጠናሉ።',
    'process.step3.title': 'ፋብሪኬሽን',
    'process.step3.subtitle': 'በዎርክሾፕ ውስጥ በጥንቃቄ ማዘጋጀት',
    'process.step3.desc': 'እያንዳንዱ የአልሙኒየም ክፍል በጥንቃቄ ይቆረጣል፣ በማሽን ይገጣጠማል፣ እና የጥራት ቁጥጥር ይደረግበታል።',
    'process.step4.title': 'ገጠማ',
    'process.step4.subtitle': 'በቦታው ላይ በባለሙያ መግጠምና ማጠናቀቅ',
    'process.step4.desc': 'ባለሙያዎቻችን በቦታው ላይ ትክክለኛውን ሌዘር አሰላለፍ ጠብቀው ይገጥማሉ፣ የውሃ ማሸጊያዎችን ያደርጋሉ፣ እና ደንበኛውን ያስረክባሉ።',

    // Quote CTA Banner
    'cta.label': 'ቀጥታ ፋብሪኬሽን እና ገጠማ',
    'cta.title': 'የህንፃ ንድፍ ወይም የስራ ዝርዝር አለዎት?',
    'cta.desc': 'የመስኮት ሰንጠረዥዎን፣ የህንፃ ንድፍዎን ወይም የተለኩ ልኬቶችን ይላኩልን። የዋጋ ባለሙያዎቻችን የተሟላ የዋጋ ዝርዝር በፍጥነት ያዘጋጁልዎታል።',
    'cta.submit': 'የዋጋ ጥያቄ ይላኩ',
    'cta.contact': 'ቢሯችንን ያነጋግሩ',
    'cta.directLine': 'ቀጥታ ስልክ',
    'cta.responseTime': 'በ24 የስራ ሰዓት ውስጥ ምላሽ እንሰጣለን',

    // Products Page
    'products.label': 'የምርት ማውጫ',
    'products.title': 'የአልሙኒየም ፕሮፋይሎች፣ መስታወቶች እና መገጣጠሚያዎች',
    'products.desc': 'ለፊት ለፊት ፊት፣ ለመስኮቶች እና ለውስጥ መከፋፈያዎች የሚውሉ ከፍተኛ ጥራት ያላቸው የአልሙኒየም እና መስታወት ምርቶች።',
    'products.searchPlaceholder': 'ምርቶችን ይፈልጉ...',
    'products.specs': 'ቴክኒካዊ መረጃዎች',
    'products.requestQuote': 'ለዚህ ምርት የዋጋ ማቅረቢያ ይጠይቁ',
    'products.inquire': 'የቴክኒክ ቡድናችንን ያማክሩ',
    'products.related': 'ተመሳሳይ ምርቶች በ',
    'products.back': 'ወደ ሁሉም ምርቶች ይመለሱ',

    // Categories
    'cat.all': 'ሁሉም',
    'cat.profiles': 'የአልሙኒየም ፕሮፋይሎች',
    'cat.glass': 'መስታወት',
    'cat.doors': 'የአልሙኒየም በሮች',
    'cat.windows': 'የአልሙኒየም መስኮቶች',
    'cat.glassDoors': 'የመስታወት በሮች',
    'cat.hardware': 'መለዋወጫዎችና እቃዎች',
    'cat.residential': 'የመኖሪያ ቤት',
    'cat.commercial': 'የንግድ ሕንፃ',
    'cat.office': 'የቢሮ',
    'cat.storefront': 'የሱቅ ፊት ለፊት',
    'cat.interior': 'የውስጥ ክፍል',
    'cat.custom': 'ልዩ ፕሮጀክቶች',

    // Quote Form Page
    'quote.label': 'የዋጋ ግምት',
    'quote.title': 'የዋጋ ማቅረቢያ ይጠይቁ',
    'quote.desc': 'የስራ ንድፍዎን፣ የመስኮት ሰንጠረዥዎን ወይም መጠኑን ይላኩልን። የዋጋ ባለሙያዎቻችን ጥናቱን ሰርተው ዝርዝር ዋጋ ያቀርቡልዎታል።',
    'quote.form.title': 'የስራው ቴክኒካዊ መረጃ',
    'quote.form.subtitle': 'ኮከብ (*) ምልክት ያለባቸው ክፍሎች በሙሉ መሞላት አለባቸው።',
    'quote.fullName': 'ሙሉ ስም',
    'quote.phone': 'ስልክ ቁጥር',
    'quote.email': 'ኢሜይል አድራሻ',
    'quote.projectType': 'የፕሮጀክት ዓይነት',
    'quote.location': 'የስራው ቦታ / አድራሻ',
    'quote.size': 'የስራው ስፋት / የዕቃዎች ብዛት',
    'quote.contactMethod': 'የሚመርጡት የመገናኛ ዘዴ',
    'quote.specs': 'የስራው ዝርዝር ማብራሪያ',
    'quote.fileUpload': 'የስራ ንድፍ / ፎቶ / ሰነድ (PDF, PNG, JPG, DWG)',
    'quote.chooseFile': 'ፋይል ይምረጡ',
    'quote.submit': 'የዋጋ ጥያቄውን ይላኩ',
    'quote.submitting': 'ጥያቄው እየተላከ ነው...',
    'quote.success.title': 'እናመሰግናለን። ጥያቄዎ ደርሶናል።',
    'quote.success.desc': 'በመረጡት የመገናኛ ዘዴ የቴክኒክ ባለሙያችን በቅርቡ ያነጋግርዎታል።',
    'quote.success.submitAnother': 'ሌላ የዋጋ ጥያቄ ይላኩ',
    'quote.method.phone': 'በስልክ ጥሪ',
    'quote.method.whatsapp': 'በዋትስአፕ (WhatsApp)',
    'quote.method.email': 'በኢሜይል',

    // Contact Page
    'contact.label': 'ቀጥታ ግንኙነት',
    'contact.title': 'ያነጋግሩን',
    'contact.desc': 'ስለሚሰሩት ስራ፣ አዲስ ፕሮጀክት ወይም የሳይት ልኬት ለመነጋገር በፈለጉት ጊዜ ያግኙን።',
    'contact.channels.title': 'የቢሮ እና የዎርክሾፕ አድራሻዎች',
    'contact.channels.desc': 'ለልኬት ቀጠሮ ለመያዝ ወይም ዎርክሾፓችንን ለመጎብኘት ያግኙን።',
    'contact.office': 'ቢሮ እና ዎርክሾፕ',
    'contact.telephone': 'ቀጥታ ስልክ',
    'contact.whatsapp': 'ዋትስአፕ',
    'contact.email': 'ኢሜይል',
    'contact.hours': 'የስራ ሰዓት',
    'contact.form.title': 'መልዕክት ይላኩ',
    'contact.form.desc': 'የሚከተለውን ቅጽ ይሙሉ፣ ተወካያችን በፍጥነት ያነጋግርዎታል።',
    'contact.subject': 'ጉዳዩ',
    'contact.message': 'መልዕክትዎ',
    'contact.send': 'መልዕክት ላክ',
    'contact.sending': 'መልዕክቱ እየተላከ ነው...',
    'contact.success.title': 'እናመሰግናለን። መልዕክትዎ ደርሶናል።',
    'contact.success.desc': 'መልዕክትዎ ደርሶናል፤ ቡድናችን አይቶ በአጭር ጊዜ ውስጥ ያነጋግርዎታል።',

    // About Page
    'about.label': 'ስለ ድርጅታችን',
    'about.title': 'በአልሙኒየም እና መስታወት ስራዎች የላቀ የምህንድስና ጥራት',
    'about.desc': 'ለበሮች፣ መስኮቶች፣ የሕንፃ ፊት ለፊት መስታወቶች እና የውስጥ መከፋፈያዎች የተሟላ የፋብሪኬሽን፣ የአቅርቦት እና የገጠማ ስራ።',
    'about.commitment': 'የጥራት ቃል ኪዳናችን',
    'about.heading': 'በጥራት እና ጥንቃቄ የተሰሩ። ለረጅም ጊዜ የሚቆዩ።',
    'about.p1': 'በአብዲ አልሙኒየም እና መስታወት በከፍተኛ ጥራት እና ትክክለኛ ልኬት የሚሰሩ የአልሙኒየም እና ዘመናዊ የመስታወት ስራዎችን እናቀርባለን። ከህንፃ ተቋራጮች፣ አርክቴክቶች እና ከግል ደንበኞች ጋር በመተባበር ዘመናዊ እና ጥንካሬ ያላቸው ስራዎችን እንሰራለን።',
    'about.p2': 'ከሱቆች እና የንግድ ሕንፃዎች ፊት ለፊት መስታወቶች ጀምሮ እስከ መኖሪያ ቤት ተንሸራታች በሮች እና የቢሮ መከፋፈያዎች ድረስ፤ ከዎርክሾፓችን የሚወጣ እያንዳንዱ ስራ ጥራቱና ጥንካሬው በጥንቃቄ ይመረመራል።',
    'about.p3': 'የአልሙኒየም እና የመስታወት ስራ ለውበት ብቻ ሳይሆን ለደህንነት፣ ለድምፅ እና ለአየር ሁኔታ መከላከያ ከፍተኛ ሚና እንዳለው እንረዳለን፤ ለዚህም ነው በጥራት እና በሙያዊ ስነ-ምግባር የምንሰራው።',
    'about.pillarsTitle': 'የአሰራር መርሆዎቻችን',
    'about.pillarsDesc': 'እያንዳንዱ ስራችን በጥራት፣ በትክክለኛ ልኬት እና በደንበኛ እርካታ ላይ የተመሰረተ ነው።',
    'about.val1.title': 'ጥንቁቅ ፋብሪኬሽን',
    'about.val1.desc': 'ትክክለኛ የማዕዘን ቁረጣ፣ ጠንካራ የመገጣጠሚያ ክሪምፒንግ እና ለረጅም ጊዜ የሚቆይ አስተማማኝ ጥንካሬ።',
    'about.val2.title': 'ጥራት ያላቸው ጥሬ ዕቃዎች',
    'about.val2.desc': 'ደረጃውን የጠበቀ የአልሙኒየም ፕሮፋይል፣ ጠንካራ ቴምፐርድ መስታወት እና ጥራት ያላቸው የውሃ ማሸጊያዎች ብቻ እንጠቀማለን።',
    'about.val3.title': 'ልዩ ዲዛይን እና ምህንድስና',
    'about.val3.desc': 'ለእያንዳንዱ ህንፃ እና የደንበኛ ፍላጎት ተስማሚ የሆነ የመስታወት ውፍረት እና የአልሙኒየም ዓይነት እናዘጋጃለን።',
    'about.val4.title': 'ሙያዊ የገጠማ ስራ',
    'about.val4.desc': 'ልምድ ባላቸው ባለሙያዎች የሚከናወን ትክክለኛ የሌዘር አሰላለፍ እና አስተማማኝ የገጠማ ስራ።',
    'about.val5.title': 'የደንበኛ እርካታ',
    'about.val5.desc': 'ፈጣን ምላሽ፣ የቦታ ልኬት በነፃ መውሰድ፣ ግልጽ የዋጋ ማቅረቢያ እና ከገጠማ በኋላ የሚደረግ ክትትል።',
    'about.val6.title': 'የላቀ የስነ-ህንፃ ውበት',
    'about.val6.desc': 'የህንፃዎን ውበት የሚጨምሩ፣ የተፈጥሮ ብርሃን የሚያስገቡ እና ለዘመናት የሚቆዩ ስራዎችን መስራት።',

    // Common / UI
    'common.back': 'ተመለስ',
    'common.viewAll': 'ሁሉንም ይመልከቱ',
    'common.requestQuote': 'ዋጋ ይጠይቁ',
    'common.contactUs': 'ያነጋግሩን',
    'common.loading': 'እየተጫነ ነው...',
    'common.noResults': 'ምንም የተገኘ ውጤት የለም።',
    'common.notFound': 'አልተገኘም',
    'common.returnHome': 'ወደ ዋና ገጽ ተመለስ',

    // Testimonials
    'test.label': 'የደንበኞች አስተያየት',
    'test.title': 'ከሕንፃ ገንቢዎች እና ከደንበኞቻችን የተሰጡ ምስክርነቶች',

    // Footer
    'footer.navigation': 'ገጾች',
    'footer.capabilities': 'ዋና ዋና ስራዎች',
    'footer.office': 'የስራ ቦታ',
    'footer.proposal': 'የዋጋ ማቅረቢያ ይጠይቁ',
    'footer.allRights': 'መብቱ በህግ የተጠበቀ ነው።',
    'footer.inquiries': 'ጥያቄዎች',
    'footer.getQuote': 'ዋጋ ለመጠየቅ',
    'footer.admin': 'የአስተዳዳሪ ክፍል',

    // WhatsApp
    'whatsapp.chat': 'ዋትስአፕ',
    'whatsapp.prefill': 'ሰላም፣ ስለ አልሙኒየም እና መስታወት አገልግሎቶቻችሁ መረጃ ማግኘት እፈልጋለሁ።'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('abdi_language');
      if (saved === 'am' || saved === 'en') return saved;
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('abdi_language', lang);
      document.documentElement.lang = lang;
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'am' : 'en');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (key: string, defaultText?: string): string => {
    return translations[language]?.[key] ?? translations.en[key] ?? defaultText ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
