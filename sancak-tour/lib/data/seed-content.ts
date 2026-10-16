import type { Accommodation, Extra, Post, Promotion, Settings, Vehicle } from "../types";
import { l, ll } from "./helpers";

export const SEED_EXTRAS: Extra[] = [
  { id: "x-airport", label: l("Airport pickup (one way)", "Havalimanı karşılama (tek yön)", "استقبال من المطار (اتجاه واحد)", "Flughafenabholung (einfache Fahrt)"), price: 30, perPerson: false, active: true },
  { id: "x-guide", label: l("Private guide in your language", "Kendi dilinizde özel rehber", "مرشد خاص بلغتك", "Privater Guide in Ihrer Sprache"), price: 60, perPerson: false, active: true },
  { id: "x-lunch", label: l("Traditional lunch", "Geleneksel öğle yemeği", "غداء تقليدي", "Traditionelles Mittagessen"), price: 14, perPerson: true, active: true },
  { id: "x-photo", label: l("Photo session with a local photographer", "Yerel fotoğrafçıyla çekim", "جلسة تصوير مع مصور محلي", "Fotoshooting mit lokalem Fotografen"), price: 80, perPerson: false, active: true },
  { id: "x-seat", label: l("Child seat", "Çocuk koltuğu", "مقعد أطفال", "Kindersitz"), price: 5, perPerson: false, active: true },
];

export const SEED_VEHICLES: Vehicle[] = [
  { id: "v-sedan", category: "sedan", passengers: 3, suitcases: 3, priceFrom: 35, active: true, scene: "road",
    name: l("Comfort Sedan", "Konfor Sedan", "سيدان مريحة", "Komfort-Limousine"),
    note: l("Ideal for couples and small families.", "Çiftler ve küçük aileler için ideal.", "مثالية للأزواج والعائلات الصغيرة.", "Ideal für Paare und kleine Familien.") },
  { id: "v-minivan", category: "minivan", passengers: 6, suitcases: 6, priceFrom: 55, active: true, scene: "road",
    name: l("Family Minivan", "Aile Minivanı", "ميني فان عائلية", "Familien-Minivan"),
    note: l("Space for families and extra luggage.", "Aileler ve fazla bagaj için geniş alan.", "مساحة للعائلات والحقائب الإضافية.", "Platz für Familien und zusätzliches Gepäck.") },
  { id: "v-suv", category: "suv", passengers: 3, suitcases: 3, priceFrom: 90, active: true, scene: "night",
    name: l("Luxury SUV (VIP)", "Lüks SUV (VIP)", "SUV فاخرة (VIP)", "Luxus-SUV (VIP)"),
    note: l("Premium comfort with a professional chauffeur.", "Profesyonel şoförle premium konfor.", "راحة فاخرة مع سائق محترف.", "Premium-Komfort mit professionellem Chauffeur.") },
  { id: "v-minibus", category: "minibus", passengers: 16, suitcases: 16, priceFrom: 0, active: true, scene: "road",
    name: l("Minibus for groups", "Gruplar için Minibüs", "ميني باص للمجموعات", "Kleinbus für Gruppen"),
    note: l("For larger groups; quote on request.", "Büyük gruplar için; fiyat talep üzerine.", "للمجموعات الكبيرة؛ السعر عند الطلب.", "Für größere Gruppen; Preis auf Anfrage.") },
];

const accDesc = (en: string, tr: string, ar: string, de: string) => l(en, tr, ar, de);

export const SEED_ACCOMMODATIONS: Accommodation[] = [
  { id: "a-1", slug: "old-town-boutique-hotel", published: true, sample: true, type: "hotel", location: "sarajevo", guests: 2, pricePerNight: 85, amenities: ["wifi", "breakfast", "view", "halal"], scene: "sarajevo",
    name: l("Old Town Boutique Hotel", "Eski Şehir Butik Otel", "فندق بوتيك المدينة القديمة", "Boutique-Hotel Altstadt"),
    description: accDesc("Sample listing: a small hotel near the old bazaar.", "Örnek ilan: eski çarşıya yakın küçük bir otel.", "قائمة تجريبية: فندق صغير قرب السوق القديم.", "Beispieleintrag: ein kleines Hotel nahe dem alten Basar.") },
  { id: "a-2", slug: "riverside-apartment-sarajevo", published: true, sample: true, type: "apartment", location: "sarajevo", guests: 4, pricePerNight: 70, amenities: ["wifi", "kitchen", "parking", "family"], scene: "sarajevo",
    name: l("Riverside Family Apartment", "Nehir Kenarı Aile Apartı", "شقة عائلية على النهر", "Familienapartment am Fluss"),
    description: accDesc("Sample listing: two bedrooms and a kitchen for families.", "Örnek ilan: aileler için iki yatak odası ve mutfak.", "قائمة تجريبية: غرفتا نوم ومطبخ للعائلات.", "Beispieleintrag: zwei Schlafzimmer und Küche für Familien.") },
  { id: "a-3", slug: "mostar-stone-house", published: true, sample: true, type: "family", location: "mostar", guests: 6, pricePerNight: 95, amenities: ["wifi", "breakfast", "parking", "family", "halal"], scene: "mostar",
    name: l("Mostar Stone House", "Mostar Taş Ev", "البيت الحجري في موستار", "Steinhaus in Mostar"),
    description: accDesc("Sample listing: a traditional-style house close to the Old Town.", "Örnek ilan: Eski Şehir'e yakın geleneksel tarzda bir ev.", "قائمة تجريبية: بيت بطراز تقليدي قرب المدينة القديمة.", "Beispieleintrag: ein Haus im traditionellen Stil nahe der Altstadt.") },
  { id: "a-4", slug: "blagaj-spring-guesthouse", published: true, sample: true, type: "family", location: "blagaj", guests: 4, pricePerNight: 60, amenities: ["wifi", "breakfast", "view"], scene: "blagaj",
    name: l("Spring-side Guesthouse", "Kaynak Kenarı Misafirhanesi", "بيت ضيافة قرب المنبع", "Gästehaus an der Quelle"),
    description: accDesc("Sample listing: quiet stay near the Buna spring.", "Örnek ilan: Buna kaynağına yakın sakin konaklama.", "قائمة تجريبية: إقامة هادئة قرب منبع بونا.", "Beispieleintrag: ruhiger Aufenthalt nahe der Buna-Quelle.") },
  { id: "a-5", slug: "jahorina-mountain-cabin", published: true, sample: true, type: "cabin", location: "jahorina", guests: 6, pricePerNight: 130, amenities: ["wifi", "fireplace", "kitchen", "parking", "view"], scene: "mountain",
    name: l("Jahorina Mountain Cabin", "Jahorina Dağ Evi", "كوخ جبلي في يهورينا", "Berghütte auf der Jahorina"),
    description: accDesc("Sample listing: a cosy cabin for winter and summer.", "Örnek ilan: kış ve yaz için sıcak bir dağ evi.", "قائمة تجريبية: كوخ دافئ للشتاء والصيف.", "Beispieleintrag: eine gemütliche Hütte für Winter und Sommer.") },
  { id: "a-6", slug: "luxury-villa-mostar-hills", published: true, sample: true, type: "villa", location: "mostar", guests: 8, pricePerNight: 260, amenities: ["wifi", "pool", "spa", "parking", "view", "transfer", "family"], scene: "night",
    name: l("Hillside Luxury Villa", "Tepe Üstü Lüks Villa", "فيلا فاخرة على التلة", "Luxusvilla am Hang"),
    description: accDesc("Sample listing: private villa with a pool.", "Örnek ilan: havuzlu özel villa.", "قائمة تجريبية: فيلا خاصة مع مسبح.", "Beispieleintrag: private Villa mit Pool.") },
  { id: "a-7", slug: "travnik-castle-view-hotel", published: true, sample: true, type: "hotel", location: "travnik", guests: 3, pricePerNight: 65, amenities: ["wifi", "breakfast", "parking", "view"], scene: "travnik",
    name: l("Castle View Hotel", "Kale Manzaralı Otel", "فندق بإطلالة على القلعة", "Hotel mit Burgblick"),
    description: accDesc("Sample listing: comfortable rooms below the fortress.", "Örnek ilan: kalenin altında konforlu odalar.", "قائمة تجريبية: غرف مريحة أسفل القلعة.", "Beispieleintrag: komfortable Zimmer unterhalb der Festung.") },
  { id: "a-8", slug: "jajce-waterfall-apartment", published: true, sample: true, type: "apartment", location: "jajce", guests: 4, pricePerNight: 55, amenities: ["wifi", "kitchen", "parking"], scene: "jajce",
    name: l("Waterfall Apartment", "Şelale Apartı", "شقة الشلال", "Wasserfall-Apartment"),
    description: accDesc("Sample listing: walking distance to the waterfall.", "Örnek ilan: şelaleye yürüme mesafesinde.", "قائمة تجريبية: على مسافة سير من الشلال.", "Beispieleintrag: fußläufig zum Wasserfall.") },
];

const P = (parts: [string, string, string, string][]) => ll(parts.map((p) => p[0]), parts.map((p) => p[1]), parts.map((p) => p[2]), parts.map((p) => p[3]));

export const SEED_POSTS: Post[] = [
  {
    id: "p-1", slug: "best-places-in-bosnia", published: true, category: "places", scene: "una", date: "2026-01-12", readMin: 5, tourIds: ["t-mostar-blagaj", "t-kravice", "t-una"],
    title: l("Seven places in Bosnia worth the journey", "Bosna'da yolculuğa değer yedi yer", "سبعة أماكن في البوسنة تستحق الرحلة", "Sieben Orte in Bosnien, die die Reise wert sind"),
    excerpt: l("From Mostar's bridge to the Una's green rapids: where to start.", "Mostar Köprüsü'nden Una'nın yeşil akıntılarına: nereden başlamalı.", "من جسر موستار إلى منحدرات أونا الخضراء: من أين تبدأ.", "Von Mostars Brücke bis zu den grünen Stromschnellen der Una: Wo man beginnt."),
    body: P([
      ["Bosnia and Herzegovina is compact but varied. In a single week you can drink coffee in an Ottoman bazaar, stand beside a travertine waterfall and sleep in a mountain village.", "Bosna-Hersek küçük ama çeşitlidir. Tek bir haftada Osmanlı çarşısında kahve içebilir, traverten bir şelalenin yanında durabilir ve bir dağ köyünde uyuyabilirsiniz.", "البوسنة والهرسك بلد صغير لكنه متنوع. في أسبوع واحد يمكنك احتساء القهوة في سوق عثماني والوقوف قرب شلال من الترافرتين والمبيت في قرية جبلية.", "Bosnien und Herzegowina ist kompakt, aber vielfältig. In einer Woche trinken Sie Kaffee im osmanischen Basar, stehen an einem Travertin-Wasserfall und schlafen in einem Bergdorf."],
      ["Start in Sarajevo, continue to Mostar and Blagaj, add the Kravice waterfalls, and head north to Travnik, Jajce and the Una valley if time allows.", "Saraybosna'dan başlayın, Mostar ve Blagay'a devam edin, Kravice şelalelerini ekleyin ve zamanınız varsa kuzeye Travnik, Yayçe ve Una vadisine çıkın.", "ابدأ من سراييفو ثم موستار وبلاغاي وأضف شلالات كرافيتسا، وإن سمح الوقت فاتجه شمالًا إلى ترافنيك ويايتسه ووادي أونا.", "Starten Sie in Sarajevo, fahren Sie weiter nach Mostar und Blagaj, ergänzen Sie die Kravica-Wasserfälle und reisen Sie bei genug Zeit nach Norden zu Travnik, Jajce und ins Una-Tal."],
      ["Distances look short on the map, but mountain roads take time. A private driver lets you stop whenever the view calls for it.", "Haritada mesafeler kısa görünür ama dağ yolları zaman alır. Özel şoför, manzara çağırdığında istediğiniz yerde durmanızı sağlar.", "تبدو المسافات قصيرة على الخريطة لكن الطرق الجبلية تستغرق وقتًا. السائق الخاص يتيح لك التوقف حيثما دعتك الإطلالة.", "Auf der Karte wirken die Distanzen kurz, doch Bergstraßen brauchen Zeit. Mit privatem Fahrer halten Sie an, wann immer die Aussicht ruft."],
    ]),
  },
  {
    id: "p-2", slug: "sarajevo-travel-guide", published: true, category: "sarajevo", scene: "sarajevo", date: "2026-01-26", readMin: 6, tourIds: ["t-sarajevo-city", "t-family-sarajevo"],
    title: l("Sarajevo in two days: a calm first-timer's guide", "İki günde Saraybosna: ilk kez gelenler için sakin rehber", "سراييفو في يومين: دليل هادئ لأول زيارة", "Sarajevo in zwei Tagen: ein entspannter Guide für Erstbesucher"),
    excerpt: l("Where to walk, what to taste and how to avoid the rush.", "Nerede yürümeli, ne tatmalı ve kalabalıktan nasıl kaçınmalı.", "أين تتمشى وماذا تتذوق وكيف تتجنب الزحام.", "Wo man spaziert, was man probiert und wie man dem Trubel ausweicht."),
    body: P([
      ["Sarajevo is best on foot. Begin early in Baščaršija, when the copper-smiths open their shutters and the smell of fresh coffee fills the lanes.", "Saraybosna en iyi yürüyerek gezilir. Bakırcıların kepenklerini açtığı ve taze kahve kokusunun sokakları doldurduğu erken saatlerde Baščaršija'dan başlayın.", "أفضل طريقة لاكتشاف سراييفو هي المشي. ابدأ مبكرًا في باشتشارشيا حين يفتح النحاسون محلاتهم وتملأ رائحة القهوة الطازجة الأزقة.", "Sarajevo erkundet man am besten zu Fuß. Beginnen Sie früh in Baščaršija, wenn die Kupferschmiede öffnen und frischer Kaffeeduft durch die Gassen zieht."],
      ["Spend the afternoon by the river and at the museums that tell the city's story, then go up to a viewpoint for the evening light.", "Öğleden sonrayı nehir kıyısında ve şehrin hikâyesini anlatan müzelerde geçirin, akşam ışığı için bir manzara noktasına çıkın.", "اقضِ بعد الظهر قرب النهر وفي المتاحف التي تروي قصة المدينة ثم اصعد إلى نقطة إطلالة لتستمتع بضوء المساء.", "Verbringen Sie den Nachmittag am Fluss und in den Museen, die die Geschichte der Stadt erzählen, und steigen Sie am Abend zu einem Aussichtspunkt für das Licht."],
      ["On day two, add a nature escape: the Vrelo Bosne springs or the Trebević cable car are easy options with children.", "İkinci gün bir doğa kaçamağı ekleyin: Vrelo Bosne kaynakları veya Trebević teleferiği çocuklarla kolay seçeneklerdir.", "في اليوم الثاني أضف رحلة طبيعية: منابع نهر البوسنة أو تلفريك تريبيفيتش خياران سهلان مع الأطفال.", "Planen Sie am zweiten Tag einen Naturausflug ein: Die Quellen von Vrelo Bosne oder die Trebević-Seilbahn sind mit Kindern leicht machbar."],
    ]),
  },
  {
    id: "p-3", slug: "mostar-travel-guide", published: true, category: "mostar", scene: "mostar", date: "2026-02-09", readMin: 5, tourIds: ["t-mostar-blagaj", "t-kravice"],
    title: l("Mostar beyond the bridge", "Köprünün ötesinde Mostar", "موستار ما بعد الجسر", "Mostar jenseits der Brücke"),
    excerpt: l("How to enjoy the Old Town when day-trip crowds arrive.", "Günübirlikçiler geldiğinde Eski Şehir'in tadını nasıl çıkarırsınız.", "كيف تستمتع بالمدينة القديمة حين يصل زوار اليوم الواحد.", "So genießen Sie die Altstadt, wenn die Tagesgäste kommen."),
    body: P([
      ["The Old Bridge was rebuilt and reopened in 2004 and is part of a UNESCO-listed historic area. It is lovely at any hour, but quietest early in the morning.", "Eski Köprü yeniden inşa edilip 2004'te açıldı ve UNESCO listesindeki tarihi bölgenin parçasıdır. Her saatte güzeldir ama en sakin hâli sabahın erken saatleridir.", "أُعيد بناء الجسر القديم وافتُتح عام 2004 وهو جزء من منطقة تاريخية مدرجة لدى اليونسكو. جميل في كل ساعة لكنه أهدأ في الصباح الباكر.", "Die Alte Brücke wurde wiederaufgebaut und 2004 eröffnet und gehört zu einem UNESCO-Welterbe-Gebiet. Sie ist zu jeder Stunde schön, am ruhigsten aber früh am Morgen."],
      ["Wander the side lanes, sit by the river for a Bosnian coffee and cross to the quieter bank for views back to the bridge.", "Yan sokaklarda dolaşın, nehir kıyısında Bosna kahvesi için ve köprüye bakan sakin yakada manzaranın tadını çıkarın.", "تجوّل في الأزقة الجانبية واحتسِ قهوة بوسنية قرب النهر ثم اعبر إلى الضفة الأهدأ لتشاهد الجسر من بعيد.", "Streifen Sie durch die Seitengassen, trinken Sie am Fluss einen bosnischen Kaffee und wechseln Sie auf das ruhigere Ufer für den Blick zurück zur Brücke."],
      ["Combine Mostar with Blagaj and Kravice for a full Herzegovina experience.", "Tam bir Hersek deneyimi için Mostar'ı Blagay ve Kravice ile birleştirin.", "اجمع بين موستار وبلاغاي وكرافيتسا لتجربة هرسكية كاملة.", "Kombinieren Sie Mostar mit Blagaj und Kravica für ein vollständiges Herzegowina-Erlebnis."],
    ]),
  },
  {
    id: "p-4", slug: "bosnia-with-children", published: true, category: "kids", scene: "kravice", date: "2026-02-23", readMin: 4, tourIds: ["t-family-sarajevo", "t-kravice", "t-skakavac"],
    title: l("Travelling Bosnia with children", "Çocuklarla Bosna seyahati", "السفر إلى البوسنة مع الأطفال", "Mit Kindern durch Bosnien reisen"),
    excerpt: l("Short drives, easy walks and places where little ones can run.", "Kısa yolculuklar, kolay yürüyüşler ve çocukların koşabileceği yerler.", "مسافات قصيرة ونزهات سهلة وأماكن يركض فيها الصغار.", "Kurze Fahrten, leichte Wege und Orte, an denen die Kleinen rennen können."),
    body: P([
      ["Plan shorter driving days and book a vehicle with space for snacks, spare clothes and a child seat.", "Sürüş günlerini kısa tutun; atıştırmalıklar, yedek kıyafetler ve çocuk koltuğu için yer olan bir araç ayarlayın.", "خطط لأيام قيادة أقصر واحجز مركبة تتسع للوجبات الخفيفة وملابس إضافية ومقعد أطفال.", "Planen Sie kürzere Fahrtage und buchen Sie ein Fahrzeug mit Platz für Snacks, Wechselkleidung und einen Kindersitz."],
      ["Parks like Vrelo Bosne and the shallow areas near waterfalls are popular with families in summer; always supervise closely near water.", "Vrelo Bosne gibi parklar ve yazın şelale yakınlarındaki sığ alanlar ailelerin favorisidir; suyun yakınında çocukları daima yakından gözetin.", "تحظى المتنزهات مثل منابع البوسنة والمناطق الضحلة قرب الشلالات بشعبية لدى العائلات في الصيف؛ راقب الأطفال عن كثب قرب الماء دائمًا.", "Parks wie Vrelo Bosne und flache Bereiche nahe Wasserfällen sind im Sommer bei Familien beliebt; beaufsichtigen Sie Kinder am Wasser stets genau."],
      ["Tell us the children's ages and we will shape the pace of the day around naps and meals.", "Çocukların yaşlarını söyleyin; günün temposunu uyku ve yemek saatlerine göre ayarlayalım.", "أخبرنا بأعمار الأطفال وسنضبط إيقاع اليوم وفق أوقات القيلولة والوجبات.", "Nennen Sie uns das Alter der Kinder, wir richten das Tagestempo nach Schlaf- und Essenszeiten aus."],
    ]),
  },
  {
    id: "p-5", slug: "halal-friendly-travel-bosnia", published: true, category: "halal", scene: "sarajevo", date: "2026-03-09", readMin: 5, tourIds: ["t-sarajevo-city", "t-vip-private"],
    title: l("Halal-friendly travel in Bosnia: practical tips", "Bosna'da helal dostu seyahat: pratik ipuçları", "السفر الصديق للمسلمين في البوسنة: نصائح عملية", "Halal-freundlich reisen in Bosnien: praktische Tipps"),
    excerpt: l("Food, prayer times and planning tips for Muslim travellers.", "Müslüman gezginler için yemek, namaz vakitleri ve planlama ipuçları.", "الطعام وأوقات الصلاة ونصائح التخطيط للمسافرين المسلمين.", "Essen, Gebetszeiten und Planungstipps für muslimische Reisende."),
    body: P([
      ["Many restaurants in Sarajevo and Mostar serve halal meat and mosques are never far away, but practices vary by venue. Ask before ordering and we can recommend places in advance.", "Saraybosna ve Mostar'daki birçok restoran helal et sunar ve camiler hiçbir zaman uzak değildir; ancak uygulamalar mekâna göre değişir. Sipariş vermeden önce sorun, biz de önceden yer önerebiliriz.", "تقدّم مطاعم كثيرة في سراييفو وموستار لحومًا حلالًا والمساجد ليست بعيدة، لكن الممارسات تختلف من مكان لآخر. اسأل قبل الطلب ويمكننا ترشيح أماكن مسبقًا.", "Viele Restaurants in Sarajevo und Mostar bieten Halal-Fleisch an und Moscheen sind nie weit, doch die Praxis variiert. Fragen Sie vor der Bestellung nach; wir empfehlen vorab gern Lokale."],
      ["We can plan stops around prayer times and arrange accommodation that suits family privacy needs.", "Molaları namaz vakitlerine göre planlayabilir, aile mahremiyetine uygun konaklama ayarlayabiliriz.", "يمكننا تخطيط التوقفات حول أوقات الصلاة وترتيب إقامة تناسب خصوصية العائلة.", "Wir planen Stopps rund um Gebetszeiten und organisieren Unterkünfte, die den Privatsphäre-Bedürfnissen der Familie entsprechen."],
      ["Always confirm specific dietary requirements with us when booking.", "Özel beslenme ihtiyaçlarınızı rezervasyon sırasında mutlaka bize bildirin.", "أكّد لنا دائمًا احتياجاتك الغذائية الخاصة عند الحجز.", "Bestätigen Sie besondere Ernährungswünsche bei der Buchung immer mit uns."],
    ]),
  },
  {
    id: "p-6", slug: "best-time-to-visit-bosnia", published: true, category: "season", scene: "mountain", date: "2026-03-23", readMin: 4, tourIds: ["t-skakavac", "t-grand-7"],
    title: l("When is the best time to visit Bosnia?", "Bosna'yı ziyaret etmek için en iyi zaman ne zaman?", "ما أفضل وقت لزيارة البوسنة؟", "Wann ist die beste Reisezeit für Bosnien?"),
    excerpt: l("Spring blossoms, summer swims, autumn colour and winter snow.", "Bahar çiçekleri, yaz yüzmeleri, sonbahar renkleri ve kış karı.", "أزهار الربيع وسباحة الصيف وألوان الخريف وثلوج الشتاء.", "Frühlingsblüte, Sommerbad, Herbstfarben und Winterschnee."),
    body: P([
      ["Late spring and early autumn usually offer comfortable temperatures for city walks and day trips.", "Geç ilkbahar ve erken sonbahar genellikle şehir yürüyüşleri ve günübirlik geziler için rahat sıcaklıklar sunar.", "يوفر أواخر الربيع وأوائل الخريف عادةً درجات حرارة مريحة للتنزه في المدن والرحلات اليومية.", "Später Frühling und früher Herbst bieten meist angenehme Temperaturen für Stadtspaziergänge und Tagesausflüge."],
      ["Summer is the season for waterfalls and swimming, and it can be hot in Herzegovina. Winter brings snow to mountains that hosted the 1984 Olympics.", "Yaz, şelaleler ve yüzme mevsimidir; Hersek'te sıcak olabilir. Kış, 1984 Olimpiyatları'na ev sahipliği yapan dağlara kar getirir.", "الصيف موسم الشلالات والسباحة وقد يكون حارًا في الهرسك. ويجلب الشتاء الثلوج إلى الجبال التي استضافت أولمبياد 1984.", "Der Sommer ist die Zeit für Wasserfälle und Baden und kann in der Herzegowina heiß sein. Der Winter bringt Schnee in die Berge der Olympischen Spiele von 1984."],
      ["Tell us when you can travel and we will suggest the best match.", "Ne zaman seyahat edebileceğinizi söyleyin, en uygun planı önerelim.", "أخبرنا متى يمكنك السفر وسنقترح الأنسب.", "Sagen Sie uns, wann Sie reisen können, und wir schlagen das Passende vor."],
    ]),
  },
];

export const SEED_PROMOS: Promotion[] = [
  { id: "promo-demo", code: "WELCOME10", percent: 10, active: true, validUntil: "2026-12-31", title: l("Welcome offer (demo)", "Hoş geldin teklifi (demo)", "عرض ترحيبي (تجريبي)", "Willkommensangebot (Demo)") },
];

export const DEMO_REVIEWS = [
  { id: "d1", country: "DE", stars: 5, text: l("A warm welcome and a well-planned day. (Demonstration text)", "Sıcak bir karşılama ve iyi planlanmış bir gün. (Demo metin)", "استقبال دافئ ويوم مخطط جيدًا. (نص تجريبي)", "Herzlicher Empfang und ein gut geplanter Tag. (Demotext)") },
  { id: "d2", country: "TR", stars: 5, text: l("Comfortable vehicle and flexible stops. (Demonstration text)", "Konforlu araç ve esnek duraklar. (Demo metin)", "مركبة مريحة ومحطات مرنة. (نص تجريبي)", "Bequemes Fahrzeug und flexible Stopps. (Demotext)") },
  { id: "d3", country: "SA", stars: 5, text: l("Clear communication from start to finish. (Demonstration text)", "Baştan sona net iletişim. (Demo metin)", "تواصل واضح من البداية إلى النهاية. (نص تجريبي)", "Klare Kommunikation von Anfang bis Ende. (Demotext)") },
];

export const DEFAULT_SETTINGS: Settings = {
  company: { name: "Sancak Tour", email: "", phone: "", address: "", legalInfoPending: true },
  whatsappNumber: process.env.WHATSAPP_NUMBER?.replace(/\D/g, "") || "",
  social: { instagram: "https://www.instagram.com/sancaktours/", facebook: "", tiktok: "", youtube: "" },
  payments: { mode: "test", card: false, paypal: false, bank: true, arrival: true, bankDetails: "" },
  homepage: {
    why: true, destinations: true, featured: true, vip: true, transfers: true, stay: true, packages: true,
    inspiration: true, reviews: true, instagram: true, faq: true, contact: true,
  },
  heroImage: "",
  heroVideo: "",
  showDemoReviews: true,
  seo: {},
  analytics: { gaId: process.env.NEXT_PUBLIC_GA_ID || "", searchConsole: process.env.GOOGLE_SITE_VERIFICATION || "" },
};
