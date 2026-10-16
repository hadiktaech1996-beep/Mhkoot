import type { Destination, SceneKind } from "../types";
import { l } from "./helpers";

export const DESTINATIONS: Record<Destination, { name: ReturnType<typeof l>; blurb: ReturnType<typeof l>; scene: SceneKind; lat: number; lng: number }> = {
  sarajevo: {
    name: l("Sarajevo", "Saraybosna", "سراييفو", "Sarajevo"),
    blurb: l("Where East meets West: bazaars, minarets and mountain-framed history.", "Doğu ile Batı'nın buluştuğu yer: çarşılar, minareler ve dağlarla çevrili tarih.", "حيث يلتقي الشرق بالغرب: أسواق ومآذن وتاريخ تحيط به الجبال.", "Wo Ost und West sich treffen: Basare, Minarette und Geschichte vor Bergkulisse."),
    scene: "sarajevo", lat: 43.8563, lng: 18.4131,
  },
  mostar: {
    name: l("Mostar", "Mostar", "موستار", "Mostar"),
    blurb: l("The Old Bridge, cobbled lanes and the turquoise Neretva.", "Eski Köprü, arnavut kaldırımlı sokaklar ve turkuaz Neretva.", "الجسر القديم والأزقة المرصوفة ونهر نيريتفا الفيروزي.", "Die Alte Brücke, Kopfsteinpflastergassen und die türkisfarbene Neretva."),
    scene: "mostar", lat: 43.3438, lng: 17.8078,
  },
  kravice: {
    name: l("Kravice Waterfalls", "Kravice Şelaleleri", "شلالات كرافيتسا", "Kravica-Wasserfälle"),
    blurb: l("A wide amphitheatre of falls and a refreshing summer swim.", "Geniş bir amfi şelale ve yazın serinleten bir yüzme keyfi.", "مدرّج واسع من الشلالات وسباحة منعشة في الصيف.", "Ein weites Wasserfall-Amphitheater und erfrischendes Baden im Sommer."),
    scene: "kravice", lat: 43.1578, lng: 17.6097,
  },
  blagaj: {
    name: l("Blagaj", "Blagay", "بلاغاي", "Blagaj"),
    blurb: l("The Buna spring beneath a sheer cliff and a centuries-old dervish house.", "Dik bir kayalığın altında Buna kaynağı ve yüzyıllık tekke.", "منبع بونا تحت جرف شاهق وتكية قديمة عمرها قرون.", "Die Buna-Quelle unter einer Felswand und ein jahrhundertealtes Derwischhaus."),
    scene: "blagaj", lat: 43.2576, lng: 17.8869,
  },
  travnik: {
    name: l("Travnik", "Travnik", "ترافنيك", "Travnik"),
    blurb: l("Fortress, fresh ćevapi and the Ottoman-era viziers' town.", "Kale, taze çevapi ve Osmanlı vezirler şehri.", "قلعة وتشيفابي طازجة ومدينة الوزراء من العهد العثماني.", "Festung, frische Ćevapi und die osmanische Wesirsstadt."),
    scene: "travnik", lat: 44.2265, lng: 17.6658,
  },
  jajce: {
    name: l("Jajce", "Yayçe", "يايتسه", "Jajce"),
    blurb: l("A medieval town with a waterfall right in its centre.", "Tam merkezinde şelalesi olan ortaçağ kenti.", "مدينة من العصور الوسطى يتوسطها شلال.", "Eine mittelalterliche Stadt mit einem Wasserfall mitten im Zentrum."),
    scene: "jajce", lat: 44.3419, lng: 17.2706,
  },
  una: {
    name: l("Una National Park", "Una Milli Parkı", "منتزه أونا الوطني", "Nationalpark Una"),
    blurb: l("Emerald river, travertine cascades and the Štrbački Buk fall.", "Zümrüt nehir, traverten kaskatlar ve Štrbački Buk şelalesi.", "نهر زمردي وشلالات من حجر الترافرتين وشلال شتربتشكي بوك.", "Smaragdgrüner Fluss, Travertinkaskaden und der Štrbački Buk."),
    scene: "una", lat: 44.7938, lng: 15.9411,
  },
  bjelasnica: {
    name: l("Bjelašnica & Skakavac", "Bjelašnica ve Skakavac", "يلاشنيتسا وسكاكافاتس", "Bjelašnica & Skakavac"),
    blurb: l("Olympic mountains, alpine meadows and hidden waterfalls near Sarajevo.", "Saraybosna yakınında olimpiyat dağları, alp çayırları ve gizli şelaleler.", "جبال أولمبية ومروج جبلية وشلالات خفية قرب سراييفو.", "Olympische Berge, Almwiesen und versteckte Wasserfälle nahe Sarajevo."),
    scene: "mountain", lat: 43.7055, lng: 18.2736,
  },
  balkans: {
    name: l("The Balkans", "Balkanlar", "البلقان", "Der Balkan"),
    blurb: l("Croatian coast, Montenegrin bays and Serbian cities beyond the border.", "Sınırın ötesinde Hırvat kıyıları, Karadağ koyları ve Sırp şehirleri.", "الساحل الكرواتي وخلجان الجبل الأسود ومدن صربيا خلف الحدود.", "Kroatische Küste, montenegrinische Buchten und serbische Städte jenseits der Grenze."),
    scene: "coast", lat: 42.65, lng: 18.09,
  },
};

export const DEST_KEYS = Object.keys(DESTINATIONS) as Destination[];
