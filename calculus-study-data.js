/**
 * ANKU EEE Materials — Calculus I (MTH0101) Adım Adım Öğrenme Modu Verisi
 * Kaynak: Paul's Online Math Notes (Prof. Paul Dawkins - Lamar University)
 * URL: https://tutorial.math.lamar.edu/Classes/CalcI/CalcI.aspx
 */
(() => {
  'use strict';

  const CALCULUS_STUDY_DATA = {
    courseCode: 'MTH0101',
    courseName: 'Calculus I (Matematik I)',
    title: 'Calculus I: Adım Adım Öğrenme Modu',
    badge: "Paul's Notes Tabanlı",
    description: "Calculus I dersinin temel konularını, dünyaca ünlü Paul's Online Math Notes metodolojisiyle adım adım öğrenin. Her konuda kavramsal özetler, formüller, adım adım açılan çözümlü örnekler ve kavrama testleri yer alır.",
    sourceMeta: {
      name: "Paul's Online Math Notes",
      author: 'Prof. Paul Dawkins (Lamar University)',
      url: 'https://tutorial.math.lamar.edu/Classes/CalcI/CalcI.aspx',
      licenseNote: 'Açık eğitim kaynağı prensipleriyle eğitim amaçlı derlenmiştir.'
    },
    weeks: [
      {
        id: 'week-1',
        number: 1,
        title: '1. Hafta: Limit Kavramı ve Sezgisel Yaklaşım',
        desc: 'Tanjant doğruları, değişim oranları ve limitin sezgisel doğası.',
        topics: [
          {
            id: 'tangents-rates',
            weekId: 'week-1',
            title: 'Tanjant Doğruları ve Değişim Oranları',
            subTitle: 'Tangent Lines and Rates of Change',
            sourceUrl: 'https://tutorial.math.lamar.edu/Classes/CalcI/Tangents_Rates.aspx',
            readTime: '10 dk',
            overview: 'Calculus temelde iki büyük problemden doğmuştur: Bir eğriye teğet olan doğrunun eğimini bulmak (Türev) ve eğrinin altında kalan alanı hesaplamak (İntegral). Bu bölümde, bir eğriye teğet olan doğrunun eğimini kesen (sekant) doğruları yardımıyla nasıl yaklaştırdığımızı ve ortalama hızdan anlık hıza nasıl geçtiğimizi inceliyoruz.',
            keyFormulas: [
              {
                label: 'Kesen (Sekant) Doğrusunun Eğimi',
                latex: 'm_{\\text{sec}} = \\frac{f(x) - f(a)}{x - a} = \\frac{f(a + h) - f(a)}{h}',
                desc: 'P(a, f(a)) ve Q(x, f(x)) noktalarından geçen doğrunun eğimi.'
              },
              {
                label: 'Tanjant (Teğet) Doğrusunun Eğimi',
                latex: 'm_{\\text{tan}} = \\lim_{x \\to a} \\frac{f(x) - f(a)}{x - a} = \\lim_{h \\to 0} \\frac{f(a+h) - f(a)}{h}',
                desc: 'Q noktası P noktasına sonsuz derecede yaklaşırken kesen eğimlerinin ulaştığı limit değeridir.'
              },
              {
                label: 'Ortalama vs. Anlık Hız',
                latex: 'v_{\\text{ort}} = \\frac{s(t_2) - s(t_1)}{t_2 - t_1} \\quad \\implies \\quad v(t) = \\lim_{\\Delta t \\to 0} \\frac{s(t + \\Delta t) - s(t)}{\\Delta t}',
                desc: 'Zaman aralığı sıfıra yaklaşırken ortalama hız, anlık hıza dönüşür.'
              }
            ],
            notes: [
              'Tanjant doğrusu, eğriyi yerel olarak en iyi temsil eden doğrusal yaklaşımdır (linear approximation).',
              'Bir noktadaki tanjant eğimi, o noktadaki anlık değişim oranına (instantaneous rate of change) eşittir.'
            ],
            examples: [
              {
                id: 'ex-tangent-1',
                title: 'Örnek 1: Parabol Üzerinde Teğet Eğimi',
                question: '$$f(x) = x^2$$ parabolünün $$P(1, 1)$$ noktasındaki teğetinin (tanjant doğrusunun) eğimini bulunuz.',
                hint: '$$x$$ değerini 1\'e yakın seçerek $$m_{\\text{sec}} = \\frac{x^2 - 1}{x - 1}$$ kesen eğimini cebirsel olarak sadeleştirin.',
                steps: [
                  {
                    title: 'Adım 1: Kesen doğrunun eğim formülünü yazalım',
                    content: 'Eğri üzerindeki keyfi bir $$Q(x, x^2)$$ noktası ile verilen $$P(1, 1)$$ noktası arasındaki kesen doğrunun eğimi:\n$$m_{\\text{sec}} = \\frac{f(x) - f(1)}{x - 1} = \\frac{x^2 - 1}{x - 1}$$'
                  },
                  {
                    title: 'Adım 2: Cebirsel sadeleştirme yapalım',
                    content: 'Paydaki iki kare farkını açalım ($$x \\neq 1$$ kabul ederek):\n$$\\frac{x^2 - 1}{x - 1} = \\frac{(x - 1)(x + 1)}{x - 1} = x + 1$$'
                  },
                  {
                    title: 'Adım 3: x değeri 1\'e yaklaşırken eğimi belirleyelim',
                    content: '$$x$$ sayısı 1\'e sonsuz yaklaştığında ($$x \\to 1$$):\n$$m_{\\text{tan}} = \\lim_{x \\to 1} (x + 1) = 1 + 1 = 2$$\n\nBöylece $$P(1,1)$$ noktasında parabolün teğetinin eğimi $$m = 2$$ olarak bulunur.'
                  }
                ],
                answer: '$$m = 2$$'
              },
              {
                id: 'ex-tangent-2',
                title: 'Örnek 2: Düşen Cismin Anlık Hızı',
                question: 'Yüksek bir kuleden serbest bırakılan bir taşın $$t$$ saniyedeki konumu (metre cinsinden) $$s(t) = 5t^2$$ olarak verilmiştir. Taşın tam $$t = 3$$ saniyedeki anlık hızını hesaplayınız.',
                hint: '$$[3, 3+h]$$ zaman aralığındaki ortalama hızı yazıp $$h \\to 0$$ limitini uygulayın.',
                steps: [
                  {
                    title: 'Adım 1: Ortalama hız formülünü kuralım',
                    content: '$$t = 3$$ ile $$t = 3 + h$$ arasındaki ortalama hız:\n$$v_{\\text{ort}} = \\frac{s(3+h) - s(3)}{h} = \\frac{5(3+h)^2 - 5(3)^2}{h}$$'
                  },
                  {
                    title: 'Adım 2: Parantezi açıp sadeleştirelim',
                    content: '$$5(9 + 6h + h^2) - 45 = 45 + 30h + 5h^2 - 45 = 30h + 5h^2$$\n\nŞimdi $$h$$\'ye bölelim:\n$$\\frac{30h + 5h^2}{h} = 30 + 5h \\quad (h \\neq 0)$$'
                  },
                  {
                    title: 'Adım 3: h sıfıra yaklaşırken limiti alalım',
                    content: '$$v(3) = \\lim_{h \\to 0} (30 + 5h) = 30\\text{ m/s}$$\n\nTaşın 3. saniyedeki anlık hızı saat yönünde aşağıya doğru 30 m/s\'dir.'
                  }
                ],
                answer: '$$v(3) = 30\\text{ m/s}$$'
              }
            ],
            quiz: {
              question: 'Bir hareketlinin konum fonksiyonu $$s(t)$$ ise, $$t=a$$ anındaki anlık hız hangi limit ifadesiyle tanımlanır?',
              options: [
                '$$\\lim_{h \\to 0} \\frac{s(a+h) - s(a)}{h}$$',
                '$$\\lim_{h \\to 0} \\frac{s(a+h) + s(a)}{h}$$',
                '$$\\frac{s(a+h) - s(a)}{a}$$',
                '$$\\lim_{a \\to 0} s(a)$$'
              ],
              correctIndex: 0,
              explanation: 'Anlık hız, konumdaki değişimin zamandaki değişime oranının, zaman aralığı sıfıra giderkenki limitidir ($$h \\to 0$$).'
            }
          },
          {
            id: 'the-limit',
            weekId: 'week-1',
            title: 'Limit Kavramı ve Tek Taraflı Limitler',
            subTitle: 'The Limit & One-Sided Limits',
            sourceUrl: 'https://tutorial.math.lamar.edu/Classes/CalcI/TheLimit.aspx',
            readTime: '12 dk',
            overview: 'Limit, bir fonksiyonun bir noktadaki DEĞERİ ile değil, o noktaya ÇOK YAKLAŞTIĞINDA nasıl davrandığı ile ilgilenir. Paul Dawkins\'in vurguladığı gibi: "$$\\lim_{x \\to a} f(x) = L$$ dediğimizde, $$x=a$$ anında ne olduğu bizi kesinlikle ilgilendirmez; yalnızca $$x$$, $$a$$\'ya yaklaşırken $$f(x)$$\'in nereye gittiği önemlidir."',
            keyFormulas: [
              {
                label: 'İki Taraflı Limit Tanımı',
                latex: '\\lim_{x \\to a} f(x) = L',
                desc: 'x değeri a\'ya her iki taraftan (sağdan ve soldan) yaklaşırken f(x) değeri L\'ye yaklaşıyorsa limit vardır ve L\'dir.'
              },
              {
                label: 'Sağdan Limit (Right-Hand Limit)',
                latex: '\\lim_{x \\to a^+} f(x) = L_1',
                desc: 'x yalnızca a\'dan büyük değerlerle (sağdan) a\'ya yaklaşır.'
              },
              {
                label: 'Soldan Limit (Left-Hand Limit)',
                latex: '\\lim_{x \\to a^-} f(x) = L_2',
                desc: 'x yalnızca a\'dan küçük değerlerle (soldan) a\'ya yaklaşır.'
              },
              {
                label: 'Limitin Varlık Teoremi',
                latex: '\\lim_{x \\to a} f(x) = L \\iff \\lim_{x \\to a^-} f(x) = L \\quad \\text{ve} \\quad \\lim_{x \\to a^+} f(x) = L',
                desc: 'Bir noktada genel limitin var olabilmesi için sağ ve sol limitlerin İKİSİNİN DE var olması ve BİRBİRİNE EŞİT olması şarttır!'
              }
            ],
            notes: [
              '$$f(a)$$ tanımlı olmak zorunda DEĞİLDİR! Fonksiyonun grafiğinde delik (hole) olsa bile limit var olabilir.',
              'Sağ limit ile sol limit farklı değerlere gidiyorsa ($$L_1 \\neq L_2$$), o noktada iki taraflı limit YOKTUR (Does Not Exist - DNE).'
            ],
            examples: [
              {
                id: 'ex-limit-1',
                title: 'Örnek 1: Tanımsız Noktada Limit',
                question: '$$\\lim_{x \\to 2} \\frac{x^2 + 4x - 12}{x^2 - 2x}$$ limitini araştırınız.',
                hint: '$$x = 2$$ doğrudan yerine konduğunda $$\\frac{0}{0}$$ belirsizliği çıkar. Pay ve paydayı çarpanlarına ayırın.',
                steps: [
                  {
                    title: 'Adım 1: Doğrudan yerine koymayı deneyelim',
                    content: 'Pay: $$2^2 + 4(2) - 12 = 4 + 8 - 12 = 0$$\nPayda: $$2^2 - 2(2) = 4 - 4 = 0$$\nİfade $$\\frac{0}{0}$$ belirsizliğindedir. Bu durum limitin olmadığı anlamına GELMEZ; ortak bir $$(x-2)$$ çarpanı olduğunu gösterir.'
                  },
                  {
                    title: 'Adım 2: Çarpanlara ayıralım',
                    content: 'Pay: $$x^2 + 4x - 12 = (x - 2)(x + 6)$$\nPayda: $$x^2 - 2x = x(x - 2)$$'
                  },
                  {
                    title: 'Adım 3: Ortak çarpanı sadeleştirip limiti alalım',
                    content: 'Limit durumunda $$x \\neq 2$$ olduğundan $$(x-2)$$ terimlerini sadeleştirebiliriz:\n$$\\lim_{x \\to 2} \\frac{(x - 2)(x + 6)}{x(x - 2)} = \\lim_{x \\to 2} \\frac{x + 6}{x} = \\frac{2 + 6}{2} = \\frac{8}{2} = 4$$'
                  }
                ],
                answer: '$$4$$'
              },
              {
                id: 'ex-limit-2',
                title: 'Örnek 2: Parçalı Fonksiyon ve Tek Taraflı Limitler',
                question: '$$f(x) = \\begin{cases} x^2 + 1, & x < 1 \\\\ 3 - x, & x > 1 \\end{cases}$$ fonksiyonu için $$\\lim_{x \\to 1^-} f(x)$$, $$\\lim_{x \\to 1^+} f(x)$$ ve $$\\lim_{x \\to 1} f(x)$$ değerlerini bulunuz.',
                hint: '1\'in solundan yaklaşırken $$x < 1$$ kuralını, sağından yaklaşırken $$x > 1$$ kuralını kullanın.',
                steps: [
                  {
                    title: 'Adım 1: Soldan limiti hesaplayalım (x < 1)',
                    content: '$$x \\to 1^-$$ durumunda fonksiyon kuralı $$x^2 + 1$$\'dir:\n$$\\lim_{x \\to 1^-} f(x) = \\lim_{x \\to 1^-} (x^2 + 1) = 1^2 + 1 = 2$$'
                  },
                  {
                    title: 'Adım 2: Sağdan limiti hesaplayalım (x > 1)',
                    content: '$$x \\to 1^+$$ durumunda fonksiyon kuralı $$3 - x$$\'tir:\n$$\\lim_{x \\to 1^+} f(x) = \\lim_{x \\to 1^+} (3 - x) = 3 - 1 = 2$$'
                  },
                  {
                    title: 'Adım 3: Genel limiti değerlendirelim',
                    content: 'Sağ ve sol limitler birbirine eşittir:\n$$\\lim_{x \\to 1^-} f(x) = 2 = \\lim_{x \\to 1^+} f(x)$$\nDolayısıyla genel limit mevcuttur ve $$\\lim_{x \\to 1} f(x) = 2$$\'dir.'
                  }
                ],
                answer: '$$\\lim_{x \\to 1^-} f(x) = 2, \\quad \\lim_{x \\to 1^+} f(x) = 2, \\quad \\lim_{x \\to 1} f(x) = 2$$'
              }
            ],
            quiz: {
              question: 'Bir $$f(x)$$ fonksiyonu için $$\\lim_{x \\to 4^-} f(x) = 7$$ ve $$\\lim_{x \\to 4^+} f(x) = -2$$ ise $$\\lim_{x \\to 4} f(x)$$ hakkında ne söylenebilir?',
              options: [
                'Limit yoktur (DNE - Does Not Exist)',
                'Limit 7\'dir',
                'Limit -2\'dir',
                'Limit ortalama değer olan 2.5\'tir'
              ],
              correctIndex: 0,
              explanation: 'Sağdan ve soldan limitler birbirine eşit olmadığında ($$7 \\neq -2$$), o noktadaki iki taraflı genel limit mevcut değildir.'
            }
          }
        ]
      },
      {
        id: 'week-2',
        number: 2,
        title: '2. Hafta: Limit Hesaplama Teknikleri',
        desc: 'Limit özellikleri, doğrudan yerine koyma, çarpanlara ayırma ve eşlenik yöntemi.',
        topics: [
          {
            id: 'limit-properties',
            weekId: 'week-2',
            title: 'Limit Özellikleri ve Doğrudan Hesaplama',
            subTitle: 'Limit Properties & Direct Evaluation',
            sourceUrl: 'https://tutorial.math.lamar.edu/Classes/CalcI/LimitProperties.aspx',
            readTime: '11 dk',
            overview: 'Her seferinde tablo veya grafik çizmek yerine, limitin cebirsel özelliklerini kullanarak analitik çözümler üretiriz. Polinomlar, rasyonel fonksiyonlar, trigonometrik ve üstel fonksiyonlar tanımlı oldukları noktalarda "doğrudan yerine koyma" (direct substitution) özelliğine sahiptir.',
            keyFormulas: [
              {
                label: 'Toplam / Fark Kuralı',
                latex: '\\lim_{x \\to a} [f(x) \\pm g(x)] = \\lim_{x \\to a} f(x) \\pm \\lim_{x \\to a} g(x)',
                desc: 'İki fonksiyonun toplamının limiti, limitlerin toplamına eşittir.'
              },
              {
                label: 'Sabit Çarpan Kuralı',
                latex: '\\lim_{x \\to a} [c \\cdot f(x)] = c \\cdot \\lim_{x \\to a} f(x)',
                desc: 'Sabit çarpan limit dışına alınabilir.'
              },
              {
                label: 'Çarpım & Bölüm Kuralları',
                latex: '\\lim [f \\cdot g] = \\lim f \\cdot \\lim g, \\quad \\lim \\left[\\frac{f}{g}\\right] = \\frac{\\lim f}{\\lim g} \\quad (\\lim g \\neq 0)',
                desc: 'Paydanın limiti sıfır olmadığı sürece bölümlerin limiti alınabilir.'
              },
              {
                label: 'Polinomlar İçin Doğrudan Yerine Koyma',
                latex: 'P(x) \\text{ bir polinom ise: } \\lim_{x \\to a} P(x) = P(a)',
                desc: 'Tüm polinom fonksiyonlarda limit, doğrudan fonksiyonun o noktadaki değeridir.'
              }
            ],
            notes: [
              'Doğrudan yerine koyduğunuzda payda sıfır çıkmıyorsa ve karmaşık bir durum yoksa, çıkan reel sayı doğrudan limit değeridir.',
              'Eğer $$\\frac{\\text{sayı}}{0}$$ çıkarsa bu bir dikey asimptottur (sonsuz limit). Eğer $$\\frac{0}{0}$$ çıkarsa cebirsel işlem gerektirir.'
            ],
            examples: [
              {
                id: 'ex-prop-1',
                title: 'Örnek 1: Polinom Fonksiyonun Limiti',
                question: '$$\\lim_{x \\to -2} (3x^3 - 5x^2 + 2x - 4)$$ limitini hesaplayınız.',
                hint: 'İfade bir polinomdur, dolayısıyla doğrudan $$x = -2$$ koyabilirsiniz.',
                steps: [
                  {
                    title: 'Adım 1: x = -2 değerini doğrudan yerine yazalım',
                    content: '$$P(-2) = 3(-2)^3 - 5(-2)^2 + 2(-2) - 4$$'
                  },
                  {
                    title: 'Adım 2: Aritmetik işlemleri sırayla yapalım',
                    content: '$$= 3(-8) - 5(4) - 4 - 4$$\n$$= -24 - 20 - 4 - 4 = -52$$'
                  }
                ],
                answer: '$$-52$$'
              },
              {
                id: 'ex-prop-2',
                title: 'Örnek 2: Tanımlı Rasyonel Fonksiyon',
                question: '$$\\lim_{x \\to 3} \\frac{2x^2 + 1}{x^2 + 4}$$ limitini hesaplayınız.',
                hint: 'Paydayı kontrol edin: $$3^2 + 4 = 13 \\neq 0$$. Doğrudan yerine koyma uygulanabilir.',
                steps: [
                  {
                    title: 'Adım 1: Pay ve paydanın limitlerini ayrı ayrı alalım',
                    content: 'Payın limiti: $$\\lim_{x \\to 3} (2x^2 + 1) = 2(3^2) + 1 = 18 + 1 = 19$$\nPaydanın limiti: $$\\lim_{x \\to 3} (x^2 + 4) = 3^2 + 4 = 9 + 4 = 13$$'
                  },
                  {
                    title: 'Adım 2: Bölüm kuralını uygulayalım',
                    content: 'Payda sıfır olmadığından:\n$$\\lim_{x \\to 3} \\frac{2x^2 + 1}{x^2 + 4} = \\frac{19}{13}$$'
                  }
                ],
                answer: '$$\\frac{19}{13}$$'
              }
            ],
            quiz: {
              question: '$$\\lim_{x \\to 1} \\frac{x^2 - 1}{x + 1}$$ limitinin sonucu nedir?',
              options: ['0', '1', '2', 'Tanımsız'],
              correctIndex: 0,
              explanation: 'Doğrudan yerine koyduğumuzda: pay $$1^2 - 1 = 0$$, payda $$1 + 1 = 2$$. $$0 / 2 = 0$$ olduğundan limit 0\'dır.'
            }
          },
          {
            id: 'computing-limits',
            weekId: 'week-2',
            title: 'Çarpanlara Ayırma ve Eşlenik ile Limit',
            subTitle: 'Computing Limits: Factoring & Conjugates',
            sourceUrl: 'https://tutorial.math.lamar.edu/Classes/CalcI/ComputingLimits.aspx',
            readTime: '15 dk',
            overview: 'Calculus sınavlarında en sık karşılaşacağınız durum $$\\frac{0}{0}$$ belirsizliğidir. Paul Dawkins\'in belirttiği gibi bu bir "cebirsel alarmdır" ve fonksiyonu sadeleştirmemiz gerektiğini söyler. İki ana araç kullanılır: 1) Çarpanlara ayırma (Factoring), 2) Köklü ifadeler için eşlenikle çarpıp bölme (Conjugate multiplication).',
            keyFormulas: [
              {
                label: '0/0 Belirsizliği Prensibi',
                latex: '\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\left[\\frac{0}{0}\\right] \\implies (x - a) \\text{ ortak çarpanını yok et!}',
                desc: 'Hem f(a)=0 hem g(a)=0 ise, her iki ifadede de (x - a) çarpanı gizlidir.'
              },
              {
                label: 'Karekök Eşleniği',
                latex: '(\\sqrt{A} - B)(\\sqrt{A} + B) = A - B^2',
                desc: 'Karekök içeren ifadelerde eşlenikle çarpmak kökü ortadan kaldırır.'
              },
              {
                label: 'İki Küp Farkı / Toplamı',
                latex: 'A^3 - B^3 = (A - B)(A^2 + AB + B^2)',
                desc: 'Üçüncü derece çarpanlara ayırmada sıklıkla kullanılır.'
              }
            ],
            notes: [
              'Eşlenikle çarparken hem PAYI hem PAYDAYI çarpmayı unutmayın, aksi takdirde ifadenin değeri değişir.',
              'Paydada veya payda kesirli ifadeler varsa (compound fractions), önce ortak paydada birleştirip sadeleştirin.'
            ],
            examples: [
              {
                id: 'ex-comp-1',
                title: 'Örnek 1: İkinci Dereceden Çarpanlara Ayırma',
                question: '$$\\lim_{t \\to -3} \\frac{t^2 - 9}{2t^2 + 7t + 3}$$ limitini hesaplayınız.',
                hint: '$$t = -3$$ koyunca $$\\frac{0}{0}$$ oluşur. Payı iki kare farkı, paydayı $$(2t+1)(t+3)$$ olarak ayırın.',
                steps: [
                  {
                    title: 'Adım 1: İfadeyi çarpanlarına ayıralım',
                    content: 'Pay: $$t^2 - 9 = (t - 3)(t + 3)$$\nPayda: $$2t^2 + 7t + 3 = (2t + 1)(t + 3)$$'
                  },
                  {
                    title: 'Adım 2: Ortak (t + 3) çarpanını sadeleştirelim',
                    content: '$$\\frac{(t - 3)(t + 3)}{(2t + 1)(t + 3)} = \\frac{t - 3}{2t + 1} \\quad (t \\neq -3)$$'
                  },
                  {
                    title: 'Adım 3: t = -3 değerini yerine yazalım',
                    content: '$$\\lim_{t \\to -3} \\frac{t - 3}{2t + 1} = \\frac{-3 - 3}{2(-3) + 1} = \\frac{-6}{-6 + 1} = \\frac{-6}{-5} = \\frac{6}{5}$$'
                  }
                ],
                answer: '$$\\frac{6}{5}$$'
              },
              {
                id: 'ex-comp-2',
                title: 'Örnek 2: Köklü İfade ve Eşlenik ile Çarpma',
                question: '$$\\lim_{x \\to 7} \\frac{\\sqrt{x + 2} - 3}{x - 7}$$ limitini hesaplayınız.',
                hint: 'Payın eşleniği olan $$(\\sqrt{x + 2} + 3)$$ ile payı ve paydayı çarpın.',
                steps: [
                  {
                    title: 'Adım 1: Belirsizliği tespit edelim',
                    content: '$$x = 7$$ yazıldığında: $$\\frac{\\sqrt{7+2} - 3}{7 - 7} = \\frac{\\sqrt{9} - 3}{0} = \\frac{0}{0}$$. Eşlenik yöntemini uygulayalım.'
                  },
                  {
                    title: 'Adım 2: Pay ve paydayı eşlenikle çarpalım',
                    content: '$$\\frac{\\sqrt{x + 2} - 3}{x - 7} \\cdot \\frac{\\sqrt{x + 2} + 3}{\\sqrt{x + 2} + 3} = \\frac{(\\sqrt{x+2})^2 - 3^2}{(x - 7)(\\sqrt{x + 2} + 3)}$$'
                  },
                  {
                    title: 'Adım 3: Payı düzenleyelim',
                    content: 'Pay: $$(x + 2) - 9 = x - 7$$\n\nŞimdi ifadeyi yazalım:\n$$\\frac{x - 7}{(x - 7)(\\sqrt{x + 2} + 3)} = \\frac{1}{\\sqrt{x + 2} + 3} \\quad (x \\neq 7)$$'
                  },
                  {
                    title: 'Adım 4: x = 7 değerini koyalım',
                    content: '$$\\lim_{x \\to 7} \\frac{1}{\\sqrt{x + 2} + 3} = \\frac{1}{\\sqrt{9} + 3} = \\frac{1}{3 + 3} = \\frac{1}{6}$$'
                  }
                ],
                answer: '$$\\frac{1}{6}$$'
              },
              {
                id: 'ex-comp-3',
                title: 'Örnek 3: Kesirli İfade (Complex Fraction)',
                question: '$$\\lim_{h \\to 0} \\frac{\\frac{1}{2+h} - \\frac{1}{2}}{h}$$ limitini hesaplayınız.',
                hint: 'Paydaki kesirleri ortak paydada birleştirin ($$2(2+h)$$).',
                steps: [
                  {
                    title: 'Adım 1: Paydaki kesirlerin ortak paydasını bulalım',
                    content: '$$\\frac{1}{2+h} - \\frac{1}{2} = \\frac{2 - (2 + h)}{2(2 + h)} = \\frac{2 - 2 - h}{2(2 + h)} = \\frac{-h}{2(2 + h)}$$'
                  },
                  {
                    title: 'Adım 2: Ana kesir çizgisine göre bölelim',
                    content: '$$\\frac{\\frac{-h}{2(2+h)}}{h} = \\frac{-h}{2(2+h)} \\cdot \\frac{1}{h} = \\frac{-1}{2(2+h)} \\quad (h \\neq 0)$$'
                  },
                  {
                    title: 'Adım 3: h = 0 limitini alalım',
                    content: '$$\\lim_{h \\to 0} \\frac{-1}{2(2+h)} = \\frac{-1}{2(2+0)} = -\\frac{1}{4}$$'
                  }
                ],
                answer: '$$-\\frac{1}{4}$$'
              }
            ],
            quiz: {
              question: '$$\\lim_{x \\to 4} \\frac{x - 4}{\\sqrt{x} - 2}$$ limitinin değeri kaçtır?',
              options: ['4', '2', '0', 'Belirsiz'],
              correctIndex: 0,
              explanation: '$$x - 4 = (\\sqrt{x} - 2)(\\sqrt{x} + 2)$$ şeklinde çarpanlara ayrılabilir. Sadeleştiğinde geriye $$\\sqrt{x} + 2$$ kalır. $$x=4$$ için $$\\sqrt{4} + 2 = 2 + 2 = 4$$ bulunur.'
            }
          }
        ]
      },
      {
        id: 'week-3',
        number: 3,
        title: '3. Hafta: Süreklilik ve Sonsuzdaki Limitler',
        desc: 'Sürekliliğin 3 şartı, süreksizlik türleri, dikey ve yatay asimptotlar.',
        topics: [
          {
            id: 'infinite-limits',
            weekId: 'week-3',
            title: 'Sonsuz Limitler ve Dikey Asimptotlar',
            subTitle: 'Infinite Limits & Vertical Asymptotes',
            sourceUrl: 'https://tutorial.math.lamar.edu/Classes/CalcI/InfiniteLimits.aspx',
            readTime: '13 dk',
            overview: 'Bir limit hesaplarken sonuç reel bir sayı olmak zorunda değildir; fonksiyon sonsuza ($$+\\infty$$) veya eksi sonsuza ($$-\\infty$$) ıraksayabilir. Doğrudan yerine koyduğunuzda $$\\frac{\\text{sıfır olmayan sayı}}{0}$$ kalıbıyla karşılaşırsanız, bu bir dikey asimptottur ve limitin $$\\pm \\infty$$ olacağını gösterir.',
            keyFormulas: [
              {
                label: 'Sonsuz Limit Kalıbı',
                latex: '\\lim_{x \\to a} \\frac{f(x)}{g(x)} \\to \\frac{c}{0} \\quad (c \\neq 0) \\implies \\text{Sonuç } +\\infty, -\\infty \\text{ veya Yoktur}',
                desc: 'İşaret analizi (sign analysis) yapılarak payın ve paydanın artı mı eksi mi olduğu incelenir.'
              },
              {
                label: 'Temel Sonsuz Limit',
                latex: '\\lim_{x \\to 0^+} \\frac{1}{x} = +\\infty, \\quad \\lim_{x \\to 0^-} \\frac{1}{x} = -\\infty',
                desc: 'Sıfıra pozitif taraftan yaklaşırken 1/x sonsuza, negatif taraftan yaklaşırken eksi sonsuza gider.'
              },
              {
                label: 'Dikey Asimptot Tanımı',
                latex: 'x = a \\text{ doğrusu dikey asimptottur } \\iff \\lim_{x \\to a^\\pm} f(x) = \\pm\\infty',
                desc: 'Sağdan veya soldan limitlerden en az biri sonsuz ise x = a dikey asimptottur.'
              }
            ],
            notes: [
              '$$+\\infty$$ ve $$-\\infty$$ birer sayı DEĞİLDİR; fonksiyonun sınırsız biçimde büyüdüğünü belirten davranış sembolleridir.',
              'Sağ limit $$+\\infty$$, sol limit $$-\\infty$$ ise iki taraflı limit "Yoktur (DNE)" şeklinde ifade edilir.'
            ],
            examples: [
              {
                id: 'ex-inf-1',
                title: 'Örnek 1: Sağdan ve Soldan Sonsuz Limit',
                question: '$$f(x) = \\frac{2}{x - 3}$$ için $$\\lim_{x \\to 3^+} f(x)$$ ve $$\\lim_{x \\to 3^-} f(x)$$ limitlerini hesaplayınız.',
                hint: '$$x = 3.01$$ (sağdan) ve $$x = 2.99$$ (soldan) değerlerini zihninizde yerine koyarak paydanın işaretini belirleyin.',
                steps: [
                  {
                    title: 'Adım 1: Sağdan yaklaşımı inceleyelim (x -> 3+)',
                    content: '$$x > 3$$ olduğundan $$x - 3 > 0$$\'dır (küçük pozitif bir sayı, örn: $$+0.001$$).\nPay pozitif ($$2$$), payda pozitif ve sıfıra çok yakın:\n$$\\lim_{x \\to 3^+} \\frac{2}{x - 3} = \\frac{2}{0^+} = +\\infty$$'
                  },
                  {
                    title: 'Adım 2: Soldan yaklaşımı inceleyelim (x -> 3-)',
                    content: '$$x < 3$$ olduğundan $$x - 3 < 0$$\'dır (küçük negatif bir sayı, örn: $$-0.001$$).\nPay pozitif ($$2$$), payda negatif ve sıfıra çok yakın:\n$$\\lim_{x \\to 3^-} \\frac{2}{x - 3} = \\frac{2}{0^-} = -\\infty$$'
                  },
                  {
                    title: 'Adım 3: Yorum ve Asimptot',
                    content: 'Sağ ve sol limitler farklı işaretli sonsuzlara gittiğinden iki taraflı genel limit YOKTUR (DNE).\n$$x = 3$$ doğrusu bu fonksiyonun dikey asimptotudur (vertical asymptote).'
                  }
                ],
                answer: '$$\\lim_{x \\to 3^+} f(x) = +\\infty, \\quad \\lim_{x \\to 3^-} f(x) = -\\infty$$'
              },
              {
                id: 'ex-inf-2',
                title: 'Örnek 2: Kareli Paydada Çift Taraflı Sonsuz Limit',
                question: '$$\\lim_{x \\to -2} \\frac{x + 1}{(x + 2)^2}$$ limitini bulunuz.',
                hint: 'Paydada $$(x+2)^2$$ olduğuna dikkat edin; bir sayının karesi sıfır hariç her zaman pozitiftir.',
                steps: [
                  {
                    title: 'Adım 1: Payın limitini hesaplayalım',
                    content: '$$x \\to -2$$ için pay: $$-2 + 1 = -1$$ (negatif sabit sayı).'
                  },
                  {
                    title: 'Adım 2: Paydanın işaretini inceleyelim',
                    content: '$$x \\to -2$$ için payda $$(x + 2)^2 \\to 0^+$$. İster sağdan ($$-1.99$$) ister soldan ($$-2.01$$) yaklaşın, karesi alındığı için payda DAİMA pozitiftir ($$0^+$$).'
                  },
                  {
                    title: 'Adım 3: Sonucu birleştirelim',
                    content: '$$\\frac{\\text{negatif}}{0^+} = -\\infty$$\n\nHer iki taraftan da negatif sonsuza gittiği için:\n$$\\lim_{x \\to -2} \\frac{x + 1}{(x + 2)^2} = -\\infty$$'
                  }
                ],
                answer: '$$-\\infty$$'
              }
            ],
            quiz: {
              question: '$$\\lim_{x \\to 5^+} \\frac{x - 7}{x - 5}$$ limitinin değeri nedir?',
              options: ['$$-\\infty$$', '$$+\\infty$$', '0', 'Yoktur (DNE)'],
              correctIndex: 0,
              explanation: 'Pay: $$5 - 7 = -2$$ (negatif). Payda ($$x \\to 5^+$$): $$5.01 - 5 = +0.01$$ (pozitif sıfır). $$\\frac{-2}{0^+} = -\\infty$$ olur.'
            }
          },
          {
            id: 'continuity',
            weekId: 'week-3',
            title: 'Süreklilik ve Süreksizlik Türleri',
            subTitle: 'Continuity & Types of Discontinuities',
            sourceUrl: 'https://tutorial.math.lamar.edu/Classes/CalcI/Continuity.aspx',
            readTime: '14 dk',
            overview: 'Sezgisel olarak süreklilik, bir fonksiyonun grafiğini kalemi kağıttan kaldırmadan çizebilmektir. Matematiksel olarak ise bir fonksiyonun bir noktada sürekli olması için 3 altın şartın aynı anda sağlanması gerekir.',
            keyFormulas: [
              {
                label: 'Sürekliliğin 3 Altın Şartı',
                latex: 'f(x) \\text{ noktasında süreklidir } \\iff \\begin{cases} 1.\\; f(c) \\text{ tanımlı olmalı} \\\\ 2.\\; \\lim_{x \\to c} f(x) \\text{ var olmalı} \\\\ 3.\\; \\lim_{x \\to c} f(x) = f(c) \\text{ olmalı} \\end{cases}',
                desc: 'Bu şartlardan biri bile bozulursa fonksiyon x = c noktasında süreksizdir (discontinuous).'
              },
              {
                label: 'Ara Değer Teoremi (IVT)',
                latex: 'f \\in C[a, b] \\text{ ve } f(a) \\neq f(b) \\implies \\forall M \\in (f(a), f(b)), \\; \\exists c \\in (a, b): f(c) = M',
                desc: 'Sürekli bir fonksiyon, başlangıç ve bitiş değerleri arasındaki tüm ara değerleri en az bir kez alır (kök bulmada temel teorem).'
              }
            ],
            notes: [
              'Kaldırılabilir Süreksizlik (Removable): Limiti vardır ancak o noktadaki fonksiyona eşit değildir (grafikte nokta boşluğu/deliği).',
              'Sıçrama Süreksizliği (Jump): Sağ ve sol limitler sonlu fakat birbirinden farklıdır.',
              'Sonsuz Süreksizlik (Infinite): Fonksiyon o noktada asimptota sahiptir.'
            ],
            examples: [
              {
                id: 'ex-cont-1',
                title: 'Örnek 1: Parçalı Fonksiyonun Süreklilik İncelemesi',
                question: '$$f(x) = \\begin{cases} x^2 - 1, & x < 3 \\\\ 2x + 2, & x \\ge 3 \\end{cases}$$ fonksiyonu $$x = 3$$ noktasında sürekli midir?',
                hint: '3 şartı sırayla test edin: 1) $$f(3)$$ nedir? 2) $$\\lim_{x \\to 3} f(x)$$ var mı? 3) Eşitler mi?',
                steps: [
                  {
                    title: 'Adım 1: Fonksiyon değerini bulalım',
                    content: '$$x = 3$$ için $$2x + 2$$ dalı kullanılır:\n$$f(3) = 2(3) + 2 = 6 + 2 = 8$$ (Tanımlıdır).'
                  },
                  {
                    title: 'Adım 2: Sağ ve sol limitleri inceleyelim',
                    content: 'Soldan limit ($$x \\to 3^-$$):\n$$\\lim_{x \\to 3^-} (x^2 - 1) = 3^2 - 1 = 9 - 1 = 8$$\n\nSağdan limit ($$x \\to 3^+$$):\n$$\\lim_{x \\to 3^+} (2x + 2) = 2(3) + 2 = 8$$\n\nSağ ve sol limit eşit olduğu için $$\\lim_{x \\to 3} f(x) = 8$$\'dir.'
                  },
                  {
                    title: 'Adım 3: Karşılaştıralım',
                    content: '$$\\lim_{x \\to 3} f(x) = 8 = f(3)$$\n\nÜç şart da sağlandığı için fonksiyon $$x = 3$$ noktasında SÜREKLİDİR.'
                  }
                ],
                answer: 'Evet, $$x = 3$$ noktasında süreklidir.'
              },
              {
                id: 'ex-cont-2',
                title: 'Örnek 2: Sürekliliği Sağlayan Parametre Bulma',
                question: '$$g(x) = \\begin{cases} c x^2 + 2x, & x < 2 \\\\ 2x^3 - c, & x \\ge 2 \\end{cases}$$ fonksiyonunun her yerde sürekli olması için $$c$$ sabiti kaç olmalıdır?',
                hint: '$$x=2$$ noktasında sol limit ile sağ limitin ($$g(2)$$) eşit olması gerekir.',
                steps: [
                  {
                    title: 'Adım 1: x = 2 noktasındaki sol limiti yazalım',
                    content: '$$\\lim_{x \\to 2^-} g(x) = c(2^2) + 2(2) = 4c + 4$$'
                  },
                  {
                    title: 'Adım 2: x = 2 noktasındaki sağ limit ve değeri yazalım',
                    content: '$$\\lim_{x \\to 2^+} g(x) = g(2) = 2(2^3) - c = 2(8) - c = 16 - c$$'
                  },
                  {
                    title: 'Adım 3: Süreklilik şartı için birbirine eşitleyelim',
                    content: '$$4c + 4 = 16 - c$$\n$$4c + c = 16 - 4$$\n$$5c = 12 \\implies c = \\frac{12}{5} = 2.4$$'
                  }
                ],
                answer: '$$c = \\frac{12}{5} = 2.4$$'
              }
            ],
            quiz: {
              question: '$$f(x) = \\frac{x^2 - 9}{x - 3}$$ fonksiyonunun $$x = 3$$ noktasındaki süreksizliği ne tür bir süreksizliktir?',
              options: [
                'Kaldırılabilir (Removable) Süreksizlik',
                'Sıçrama (Jump) Süreksizliği',
                'Sonsuz (Infinite) Süreksizlik',
                'Süreksiz değildir, süreklidir'
              ],
              correctIndex: 0,
              explanation: 'Çünkü $$\\lim_{x \\to 3} \\frac{(x-3)(x+3)}{x-3} = 6$$ limiti mevcuttur; sadece $$f(3)$$ tanımsızdır. O noktaya tek bir nokta ($$(3, 6)$$) eklenerek süreksizlik giderilebilir (kaldırılabilir).'
            }
          },
          {
            id: 'limits-at-infinity',
            weekId: 'week-3',
            title: 'Sonsuzdaki Limitler ve Yatay Asimptotlar',
            subTitle: 'Limits at Infinity & Horizontal Asymptotes',
            sourceUrl: 'https://tutorial.math.lamar.edu/Classes/CalcI/LimitsAtInfinityI.aspx',
            readTime: '15 dk',
            overview: 'Bu konuda $$x$$ sayısının sonsuza ($$x \\to \\infty$$) veya eksi sonsuza ($$x \\to -\\infty$$) doğru sınırsız büyüdüğünde fonksiyonun nasıl bir sonuca yaklaştığını inceliyoruz. Bu limitler fonksiyonun yatay asimptotlarını (horizontal asymptotes) verir.',
            keyFormulas: [
              {
                label: 'Temel Sonsuzdaki Limit Özelliği',
                latex: 'r > 0 \\text{ rasyonel sayı ise: } \\lim_{x \\to \\infty} \\frac{1}{x^r} = 0, \\quad \\lim_{x \\to -\\infty} \\frac{1}{x^r} = 0',
                desc: 'Payda sonsuza giderken kesir sıfıra yaklaşır.'
              },
              {
                label: 'Rasyonel Fonksiyonlar İçin En Yüksek Dereceye Bölme',
                latex: '\\lim_{x \\to \\pm\\infty} \\frac{a_n x^n + \\dots}{b_m x^m + \\dots} = \\lim_{x \\to \\pm\\infty} \\frac{a_n x^n}{b_m x^m}',
                desc: 'Pay ve paydayı paydadaki en yüksek dereceli x terimine böleriz.'
              },
              {
                label: 'Yatay Asimptot Tanımı',
                latex: 'y = L \\text{ doğrusu yatay asimptottur } \\iff \\lim_{x \\to \\infty} f(x) = L \\quad \\text{veya} \\quad \\lim_{x \\to -\\infty} f(x) = L',
                desc: 'Grafik sonsuza giderken y = L doğrusuna yapışır.'
              }
            ],
            notes: [
              'Dereceler eşitse ($$n = m$$), limit başkatsayıların oranıdır ($$a_n / b_m$$).',
              'Payın derecesi küçükse ($$n < m$$), limit daima 0\'dır ($$y = 0$$ yatay asimptot).',
              'Payın derecesi büyükse ($$n > m$$), yatay asimptot yoktur, limit $$\\pm \\infty$$ olur.'
            ],
            examples: [
              {
                id: 'ex-inf-lim-1',
                title: 'Örnek 1: Eşit Dereceli Polinomların Oranı',
                question: '$$\\lim_{x \\to \\infty} \\frac{3x^2 - 5x + 4}{2x^2 + 7}$$ limitini hesaplayınız.',
                hint: 'Pay ve paydayı en büyük derece olan $$x^2$$\'ye bölün.',
                steps: [
                  {
                    title: 'Adım 1: Her terimi x^2 ile bölelim',
                    content: '$$\\frac{\\frac{3x^2}{x^2} - \\frac{5x}{x^2} + \\frac{4}{x^2}}{\\frac{2x^2}{x^2} + \\frac{7}{x^2}} = \\frac{3 - \\frac{5}{x} + \\frac{4}{x^2}}{2 + \\frac{7}{x^2}}$$'
                  },
                  {
                    title: 'Adım 2: x -> sonsuz limitini uygulayalım',
                    content: '$$x \\to \\infty$$ iken $$\\frac{5}{x} \\to 0$$, $$\\frac{4}{x^2} \\to 0$$ ve $$\\frac{7}{x^2} \\to 0$$ olur:\n$$\\lim_{x \\to \\infty} \\frac{3 - 0 + 0}{2 + 0} = \\frac{3}{2}$$'
                  },
                  {
                    title: 'Adım 3: Yatay Asimptot Yorumu',
                    content: 'Fonksiyonun $$x \\to \\infty$$ için yatay asimptotu $$y = \\frac{3}{2}$$ doğrusudur.'
                  }
                ],
                answer: '$$\\frac{3}{2}$$'
              },
              {
                id: 'ex-inf-lim-2',
                title: 'Örnek 2: Karekök İçeren Sonsuzdaki Limit',
                question: '$$\\lim_{x \\to \\infty} \\frac{\\sqrt{4x^2 + 1}}{3x - 2}$$ limitini hesaplayınız.',
                hint: 'Kök içindeki $$x^2$$ terimini dışarı çıkarın: $$x > 0$$ için $$\\sqrt{x^2} = x$$.',
                steps: [
                  {
                    title: 'Adım 1: Kök içinde x^2 parantezine alalım',
                    content: '$$\\sqrt{4x^2 + 1} = \\sqrt{x^2 \\left(4 + \\frac{1}{x^2}\\right)} = |x|\\sqrt{4 + \\frac{1}{x^2}}$$\n\n$$x \\to \\infty$$ durumunda $$x > 0$$ olduğundan $$|x| = x$$\'tir:\n$$= x \\sqrt{4 + \\frac{1}{x^2}}$$'
                  },
                  {
                    title: 'Adım 2: Pay ve paydayı x ile sadeleştirelim',
                    content: '$$\\frac{x \\sqrt{4 + \\frac{1}{x^2}}}{x \\left(3 - \\frac{2}{x}\\right)} = \\frac{\\sqrt{4 + \\frac{1}{x^2}}}{3 - \\frac{2}{x}}$$'
                  },
                  {
                    title: 'Adım 3: Limiti alalım',
                    content: '$$x \\to \\infty$$ için:\n$$\\frac{\\sqrt{4 + 0}}{3 - 0} = \\frac{\\sqrt{4}}{3} = \\frac{2}{3}$$'
                  }
                ],
                answer: '$$\\frac{2}{3}$$'
              }
            ],
            quiz: {
              question: '$$\\lim_{x \\to \\infty} \\frac{5x^3 - 2}{x^4 + 10x}$$ limitinin değeri kaçtır?',
              options: ['0', '5', '$$\\infty$$', 'Tanımsız'],
              correctIndex: 0,
              explanation: 'Paydanın derecesi (4), payın derecesinden (3) daha büyüktür. Dolayısıyla payda çok daha hızlı büyüyeceğinden limit 0\'dır ($$y = 0$$ yatay asimptottur).'
            }
          }
        ]
      }
    ]
  };

  window.CALCULUS_STUDY_DATA = Object.freeze(CALCULUS_STUDY_DATA);
})();
