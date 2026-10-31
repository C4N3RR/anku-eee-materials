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
    title: 'Calculus I: Adım Adım Öğrenme',
    badge: "Paul's Notes Tabanlı",
    description: "Calculus I dersinin temel konularını Paul's Online Math Notes metodolojisiyle adım adım öğrenin.",
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
            topicNum: '1.1',
            title: 'Tanjant Doğruları ve Değişim Oranları',
            subTitle: 'Tangent Lines and Rates of Change',
            sourceUrl: 'https://tutorial.math.lamar.edu/Classes/CalcI/Tangents_Rates.aspx',
            readTime: '10 dk',
            overview: 'Calculus iki temel problemden doğmuştur: Bir eğriye teğet olan doğrunun eğimini bulmak (Türev) ve eğrinin altında kalan alanı hesaplamak (İntegral). Bir noktadaki teğet (tanjant) eğimi, o noktaya yaklaşan kesen (sekant) doğrularının limitidir. Benzer şekilde, zaman aralığı sıfıra yaklaşırken ortalama hız anlık hıza dönüşür.',
            keyFormulas: [
              {
                label: 'Kesen (Sekant) Eğimi',
                latex: 'm_{\\text{sec}} = \\frac{f(x) - f(a)}{x - a} = \\frac{f(a + h) - f(a)}{h}',
                desc: 'P(a, f(a)) ve Q(x, f(x)) noktalarını birleştiren doğrunun eğimidir.'
              },
              {
                label: 'Tanjant (Teğet) Eğimi',
                latex: 'm_{\\text{tan}} = \\lim_{x \\to a} \\frac{f(x) - f(a)}{x - a} = \\lim_{h \\to 0} \\frac{f(a+h) - f(a)}{h}',
                desc: 'Q noktası P noktasına sonsuz derecede yaklaşırken kesen eğimlerinin ulaştığı limittir.'
              },
              {
                label: 'Ortalama ve Anlık Hız',
                latex: 'v_{\\text{ort}} = \\frac{\\Delta s}{\\Delta t} \\quad \\implies \\quad v(t) = \\lim_{\\Delta t \\to 0} \\frac{s(t + \\Delta t) - s(t)}{\\Delta t}',
                desc: 'Zaman aralığı sıfıra yaklaşırken ortalama hız, anlık hıza dönüşür.'
              }
            ],
            notes: [
              'Tanjant doğrusu, fonksiyon eğrisini verilen noktanın civarında en iyi temsil eden doğrusal yaklaşımdır.',
              'Bir noktadaki tanjant eğimi, o noktadaki anlık değişim oranına (instantaneous rate of change) eşittir.'
            ],
            examples: [
              {
                id: 'ex-tangent-1',
                title: 'Örnek 1: Parabol Üzerinde Teğet Eğimi',
                question: '$f(x) = x^2$ parabolünün $P(1, 1)$ noktasındaki teğetinin (tanjant doğrusunun) eğimini bulunuz.',
                hint: 'Kesen doğrunun eğimini $m = \\frac{x^2 - 1}{x - 1}$ şeklinde yazıp cebirsel olarak sadeleştirin.',
                steps: [
                  {
                    title: 'Adım 1: Kesen eğimini yazalım',
                    content: 'Eğri üzerindeki keyfi bir $Q(x, x^2)$ noktası ile $P(1, 1)$ arasındaki kesen eğimi:\n$$m_{\\text{sec}} = \\frac{f(x) - f(1)}{x - 1} = \\frac{x^2 - 1}{x - 1}$$'
                  },
                  {
                    title: 'Adım 2: Cebirsel sadeleştirme',
                    content: 'Payı iki kare farkı olarak açalım ($x \\neq 1$):\n$$\\frac{(x - 1)(x + 1)}{x - 1} = x + 1$$'
                  },
                  {
                    title: 'Adım 3: Limiti alalım',
                    content: '$x$ sayısı 1\'e yaklaşırken ($x \\to 1$):\n$$m_{\\text{tan}} = \\lim_{x \\to 1} (x + 1) = 1 + 1 = 2$$\nBöylece $P(1,1)$ noktasındaki teğetin eğimi $m = 2$ bulunur.'
                  }
                ],
                answer: '$m = 2$'
              },
              {
                id: 'ex-tangent-2',
                title: 'Örnek 2: Düşen Cismin Anlık Hızı',
                question: 'Bir cismin $t$ saniyedeki konumu $s(t) = 5t^2$ (metre) olarak verilmiştir. Cismin tam $t = 3$ saniyedeki anlık hızını hesaplayınız.',
                hint: '$[3, 3+h]$ aralığındaki ortalama hızı yazıp $h \\to 0$ limitine geçin.',
                steps: [
                  {
                    title: 'Adım 1: Ortalama hızı kuralım',
                    content: '$$v_{\\text{ort}} = \\frac{s(3+h) - s(3)}{h} = \\frac{5(3+h)^2 - 5(3)^2}{h}$$'
                  },
                  {
                    title: 'Adım 2: Parantezi açıp sadeleştirelim',
                    content: '$$5(9 + 6h + h^2) - 45 = 30h + 5h^2 \\implies \\frac{30h + 5h^2}{h} = 30 + 5h \\quad (h \\neq 0)$$'
                  },
                  {
                    title: 'Adım 3: Anlık hız limitini alalım',
                    content: '$$v(3) = \\lim_{h \\to 0} (30 + 5h) = 30\\text{ m/s}$$'
                  }
                ],
                answer: '$v(3) = 30\\text{ m/s}$'
              }
            ],
            quiz: {
              question: 'Konum fonksiyonu $s(t)$ olan bir cismin $t = a$ anındaki anlık hızı hangi limit ile tanımlanır?',
              options: [
                '$\\lim_{h \\to 0} \\frac{s(a+h) - s(a)}{h}$',
                '$\\lim_{h \\to 0} \\frac{s(a+h) + s(a)}{h}$',
                '$\\frac{s(a+h) - s(a)}{a}$',
                '$\\lim_{a \\to 0} s(a)$'
              ],
              correctIndex: 0,
              explanation: 'Anlık hız, konumdaki değişimin zamandaki değişime oranının zaman aralığı sıfıra giderkenki ($h \\to 0$) limitidir.'
            }
          },
          {
            id: 'the-limit',
            weekId: 'week-1',
            topicNum: '1.2',
            title: 'Limit Kavramı ve Tek Taraflı Limitler',
            subTitle: 'The Limit & One-Sided Limits',
            sourceUrl: 'https://tutorial.math.lamar.edu/Classes/CalcI/TheLimit.aspx',
            readTime: '12 dk',
            overview: 'Limit, fonksiyonun bir noktadaki değeriyle değil, o noktaya çok yaklaştığında nasıl davrandığı ile ilgilenir. Paul Dawkins\'in vurguladığı gibi: $\\lim_{x \\to a} f(x) = L$ dediğimizde $x = a$ noktasında ne olduğu bizi ilgilendirmez; önemli olan $x$, $a$\'ya yaklaşırken $f(x)$\'in hangi değere yaklaştığıdır.',
            keyFormulas: [
              {
                label: 'İki Taraflı Limit',
                latex: '\\lim_{x \\to a} f(x) = L',
                desc: 'x sayısı a\'ya her iki taraftan yaklaşırken f(x) sayısı L\'ye yaklaşıyorsa limit vardır.'
              },
              {
                label: 'Sağdan ve Soldan Limit',
                latex: '\\lim_{x \\to a^+} f(x) = L_1, \\quad \\lim_{x \\to a^-} f(x) = L_2',
                desc: 'x > a için sağdan (+), x < a için soldan (-) yaklaşılır.'
              },
              {
                label: 'Limitin Varlık Şartı',
                latex: '\\lim_{x \\to a} f(x) = L \\iff \\lim_{x \\to a^-} f(x) = \\lim_{x \\to a^+} f(x) = L',
                desc: 'Bir noktada limitin var olabilmesi için sağ ve sol limitlerin eşit olması zorunludur.'
              }
            ],
            notes: [
              '$f(a)$ noktasının tanımlı olması gerekmez; grafikte delik (hole) olsa bile limit mevcut olabilir.',
              'Sağ limit ile sol limit farklı değerlere gidiyorsa ($L_1 \\neq L_2$), iki taraflı limit YOKTUR (DNE).'
            ],
            examples: [
              {
                id: 'ex-limit-1',
                title: 'Örnek 1: Tanımsız Noktada Limit',
                question: '$\\displaystyle \\lim_{x \\to 2} \\frac{x^2 + 4x - 12}{x^2 - 2x}$ limitini hesaplayınız.',
                hint: '$x = 2$ yazıldığında $0/0$ belirsizliği çıkar. Pay ve paydayı çarpanlarına ayırın.',
                steps: [
                  {
                    title: 'Adım 1: Belirsizliği görelim',
                    content: 'Doğrudan yerine koyunca pay $2^2 + 8 - 12 = 0$, payda $4 - 4 = 0$ olur. İfade $0/0$ belirsizliğindedir.'
                  },
                  {
                    title: 'Adım 2: Çarpanlara ayırma',
                    content: 'Pay: $x^2 + 4x - 12 = (x - 2)(x + 6)$\nPayda: $x^2 - 2x = x(x - 2)$'
                  },
                  {
                    title: 'Adım 3: Sadeleştirme ve sonuç',
                    content: 'Limit durumunda $x \\neq 2$ olduğundan $(x-2)$ terimlerini sadeleştirelim:\n$$\\lim_{x \\to 2} \\frac{x + 6}{x} = \\frac{2 + 6}{2} = \\frac{8}{2} = 4$$'
                  }
                ],
                answer: '$4$'
              },
              {
                id: 'ex-limit-2',
                title: 'Örnek 2: Parçalı Fonksiyon Limiti',
                question: '$f(x) = \\displaystyle \\begin{cases} x^2 + 1, & x < 1 \\\\ 3 - x, & x > 1 \\end{cases}$ fonksiyonu için $\\displaystyle \\lim_{x \\to 1} f(x)$ değerini inceleyiniz.',
                hint: '$x = 1$ noktasında kural değiştiğinden sağdan ($x > 1$) ve soldan ($x < 1$) limitleri ayrı ayrı hesaplayın.',
                steps: [
                  {
                    title: 'Adım 1: Soldan limit (x < 1)',
                    content: '$$\\lim_{x \\to 1^-} f(x) = \\lim_{x \\to 1^-} (x^2 + 1) = 1^2 + 1 = 2$$'
                  },
                  {
                    title: 'Adım 2: Sağdan limit (x > 1)',
                    content: '$$\\lim_{x \\to 1^+} f(x) = \\lim_{x \\to 1^+} (3 - x) = 3 - 1 = 2$$'
                  },
                  {
                    title: 'Adım 3: Karar',
                    content: 'Sağ ve sol limit eşit olduğundan ($2 = 2$), genel limit vardır ve $\\lim_{x \\to 1} f(x) = 2$ bulunur.'
                  }
                ],
                answer: '$\\lim_{x \\to 1} f(x) = 2$'
              }
            ],
            quiz: {
              question: 'Bir fonksiyon için $\\lim_{x \\to 4^-} f(x) = 7$ ve $\\lim_{x \\to 4^+} f(x) = -2$ ise $\\lim_{x \\to 4} f(x)$ hakkında ne söylenebilir?',
              options: [
                'Limit yoktur (DNE)',
                'Limit 7\'dir',
                'Limit -2\'dir',
                'Limit 2.5\'tir'
              ],
              correctIndex: 0,
              explanation: 'Sağ ve sol limitler birbirine eşit olmadığında ($7 \\neq -2$), iki taraflı limit mevcut değildir.'
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
            topicNum: '2.1',
            title: 'Limit Özellikleri ve Doğrudan Hesaplama',
            subTitle: 'Limit Properties & Direct Evaluation',
            sourceUrl: 'https://tutorial.math.lamar.edu/Classes/CalcI/LimitProperties.aspx',
            readTime: '11 dk',
            overview: 'Her seferinde tablo yapmak yerine limitin cebirsel kurallarını kullanırız. Polinomlar, rasyonel ifadeler ve trigonometrik fonksiyonlar tanımlı oldukları noktalarda "doğrudan yerine koyma" (direct substitution) özelliğine sahiptir.',
            keyFormulas: [
              {
                label: 'Toplam ve Fark Kuralı',
                latex: '\\lim [f(x) \\pm g(x)] = \\lim f(x) \\pm \\lim g(x)',
                desc: 'Fonksiyonların toplamının limiti, limitlerin toplamına eşittir.'
              },
              {
                label: 'Çarpım ve Bölüm Kuralı',
                latex: '\\lim [f \\cdot g] = \\lim f \\cdot \\lim g, \\quad \\lim \\left[\\frac{f}{g}\\right] = \\frac{\\lim f}{\\lim g} \\; (\\lim g \\neq 0)',
                desc: 'Paydanın limiti sıfır olmadığı sürece bölümlerin limiti alınabilir.'
              },
              {
                label: 'Polinomlarda Doğrudan Yerine Koyma',
                latex: 'P(x) \\text{ bir polinom ise: } \\lim_{x \\to a} P(x) = P(a)',
                desc: 'Polinomlarda limit, doğrudan fonksiyonun o noktadaki değeridir.'
              }
            ],
            notes: [
              'Doğrudan yerine koyduğunuzda payda sıfır çıkmıyorsa, bulunan reel sayı limitin kendisidir.',
              'Eğer $\\frac{\\text{sayı}}{0}$ çıkarsa dikey asimptottur (sonsuz limit). $\\frac{0}{0}$ çıkarsa cebirsel sadeleştirme gerekir.'
            ],
            examples: [
              {
                id: 'ex-prop-1',
                title: 'Örnek 1: Polinom Fonksiyonun Limiti',
                question: '$\\displaystyle \\lim_{x \\to -2} (3x^3 - 5x^2 + 2x - 4)$ limitini hesaplayınız.',
                hint: 'İfade bir polinomdur; doğrudan $x = -2$ yazabilirsiniz.',
                steps: [
                  {
                    title: 'Adım 1: x = -2 değerini yerine yazalım',
                    content: '$$P(-2) = 3(-2)^3 - 5(-2)^2 + 2(-2) - 4$$'
                  },
                  {
                    title: 'Adım 2: Aritmetik işlemler',
                    content: '$$= 3(-8) - 5(4) - 4 - 4 = -24 - 20 - 4 - 4 = -52$$'
                  }
                ],
                answer: '$-52$'
              },
              {
                id: 'ex-prop-2',
                title: 'Örnek 2: Tanımlı Rasyonel Fonksiyon',
                question: '$\\displaystyle \\lim_{x \\to 3} \\frac{2x^2 + 1}{x^2 + 4}$ limitini hesaplayınız.',
                hint: 'Paydayı kontrol edin: $3^2 + 4 = 13 \\neq 0$. Doğrudan yerine koyma uygulanabilir.',
                steps: [
                  {
                    title: 'Adım 1: Pay ve paydanın limitini alalım',
                    content: 'Pay: $2(3^2) + 1 = 19$\nPayda: $3^2 + 4 = 13$'
                  },
                  {
                    title: 'Adım 2: Bölüm sonucunu yazalım',
                    content: 'Payda sıfır olmadığından doğrudan:\n$$\\lim_{x \\to 3} \\frac{2x^2 + 1}{x^2 + 4} = \\frac{19}{13}$$'
                  }
                ],
                answer: '$\\frac{19}{13}$'
              }
            ],
            quiz: {
              question: '$\\displaystyle \\lim_{x \\to 1} \\frac{x^2 - 1}{x + 1}$ limitinin sonucu nedir?',
              options: ['0', '1', '2', 'Tanımsız'],
              correctIndex: 0,
              explanation: 'Doğrudan yerine koyunca pay $1 - 1 = 0$, payda $1 + 1 = 2$ olur. $0/2 = 0$ bulunur.'
            }
          },
          {
            id: 'computing-limits',
            weekId: 'week-2',
            topicNum: '2.2',
            title: 'Çarpanlara Ayırma ve Eşlenik ile Limit',
            subTitle: 'Computing Limits: Factoring & Conjugates',
            sourceUrl: 'https://tutorial.math.lamar.edu/Classes/CalcI/ComputingLimits.aspx',
            readTime: '15 dk',
            overview: 'Sınavlarda en sık karşımıza çıkan durum $\\frac{0}{0}$ belirsizliğidir. Paul Dawkins bunu "cebirsel alarm" olarak adlandırır: Pay ve paydada gizlenmiş olan ortak $(x - a)$ çarpanını bulup yok etmemiz gerekir.',
            keyFormulas: [
              {
                label: '0/0 Belirsizliği Prensibi',
                latex: '\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\left[\\frac{0}{0}\\right] \\implies (x - a) \\text{ ortak çarpanını sadeleştir!}',
                desc: 'Hem f(a)=0 hem g(a)=0 ise her iki ifadede (x - a) çarpanı mevcuttur.'
              },
              {
                label: 'Karekök Eşleniği',
                latex: '(\\sqrt{A} - B)(\\sqrt{A} + B) = A - B^2',
                desc: 'Köklü terim içeren belirsizliklerde eşlenikle çarpmak kökü kaldırır.'
              }
            ],
            notes: [
              'Eşlenikle çarparken hem payı hem de paydayı aynı terimle çarpmayı unutmayın.',
              'İç içe kesirlerde (compound fractions) önce paydaları eşitleyip tek bir kesre indirgeyin.'
            ],
            examples: [
              {
                id: 'ex-comp-1',
                title: 'Örnek 1: İkinci Dereceden Çarpanlara Ayırma',
                question: '$\\displaystyle \\lim_{t \\to -3} \\frac{t^2 - 9}{2t^2 + 7t + 3}$ limitini hesaplayınız.',
                hint: '$t = -3$ koyunca $0/0$ olur. Payı $(t-3)(t+3)$, paydayı $(2t+1)(t+3)$ olarak ayırın.',
                steps: [
                  {
                    title: 'Adım 1: Çarpanlara ayıralım',
                    content: '$$\\frac{t^2 - 9}{2t^2 + 7t + 3} = \\frac{(t - 3)(t + 3)}{(2t + 1)(t + 3)}$$'
                  },
                  {
                    title: 'Adım 2: Ortak çarpanı sadeleştirelim',
                    content: '$t \\neq -3$ için $(t + 3)$ terimlerini sadeleştirelim:\n$$= \\frac{t - 3}{2t + 1}$$'
                  },
                  {
                    title: 'Adım 3: Limiti hesaplayalım',
                    content: '$$\\lim_{t \\to -3} \\frac{t - 3}{2t + 1} = \\frac{-3 - 3}{2(-3) + 1} = \\frac{-6}{-5} = \\frac{6}{5}$$'
                  }
                ],
                answer: '$\\frac{6}{5}$'
              },
              {
                id: 'ex-comp-2',
                title: 'Örnek 2: Köklü İfade ve Eşlenik ile Çarpma',
                question: '$\\displaystyle \\lim_{x \\to 7} \\frac{\\sqrt{x + 2} - 3}{x - 7}$ limitini hesaplayınız.',
                hint: 'Payın eşleniği olan $(\\sqrt{x + 2} + 3)$ ile payı ve paydayı çarpın.',
                steps: [
                  {
                    title: 'Adım 1: Belirsizliği tespit edelim',
                    content: '$x = 7$ yazıldığında: $\\frac{\\sqrt{9} - 3}{0} = \\frac{0}{0}$ çıkar.'
                  },
                  {
                    title: 'Adım 2: Eşlenikle çarpıp sadeleştirelim',
                    content: '$$\\frac{\\sqrt{x + 2} - 3}{x - 7} \\cdot \\frac{\\sqrt{x + 2} + 3}{\\sqrt{x + 2} + 3} = \\frac{(x + 2) - 9}{(x - 7)(\\sqrt{x + 2} + 3)} = \\frac{x - 7}{(x - 7)(\\sqrt{x + 2} + 3)}$$'
                  },
                  {
                    title: 'Adım 3: (x - 7) terimini sadeleştirip limiti alalım',
                    content: '$$\\lim_{x \\to 7} \\frac{1}{\\sqrt{x + 2} + 3} = \\frac{1}{\\sqrt{9} + 3} = \\frac{1}{6}$$'
                  }
                ],
                answer: '$\\frac{1}{6}$'
              }
            ],
            quiz: {
              question: '$\\displaystyle \\lim_{x \\to 4} \\frac{x - 4}{\\sqrt{x} - 2}$ limitinin değeri kaçtır?',
              options: ['4', '2', '0', 'Belirsiz'],
              correctIndex: 0,
              explanation: '$x - 4 = (\\sqrt{x} - 2)(\\sqrt{x} + 2)$ olarak açılır. Sadeleşince geriye $\\sqrt{x} + 2$ kalır. $x = 4$ için $\\sqrt{4} + 2 = 4$ olur.'
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
            topicNum: '3.1',
            title: 'Sonsuz Limitler ve Dikey Asimptotlar',
            subTitle: 'Infinite Limits & Vertical Asymptotes',
            sourceUrl: 'https://tutorial.math.lamar.edu/Classes/CalcI/InfiniteLimits.aspx',
            readTime: '13 dk',
            overview: 'Limit sonucu her zaman sonlu bir reel sayı çıkmaz; fonksiyon sonsuza ($+\\infty$) veya eksi sonsuza ($-\\infty$) ıraksayabilir. Doğrudan yerine koyduğunuzda $\\frac{c}{0}$ ($c \\neq 0$) kalıbı çıkıyorsa bu bir dikey asimptottur ve sonuç işaret analizine göre $\\pm \\infty$ olur.',
            keyFormulas: [
              {
                label: 'Sonsuz Limit Kalıbı',
                latex: '\\lim_{x \\to a} \\frac{f(x)}{g(x)} \\to \\frac{c}{0} \\; (c \\neq 0) \\implies +\\infty, -\\infty \\text{ veya Yoktur}',
                desc: 'İşaret analizi (sign analysis) ile payın ve paydanın artı/eksi durumu incelenir.'
              },
              {
                label: 'Dikey Asimptot Tanımı',
                latex: 'x = a \\text{ dikey asimptottur } \\iff \\lim_{x \\to a^\\pm} f(x) = \\pm\\infty',
                desc: 'Sağdan veya soldan limitlerden en az biri sonsuz ise x = a doğrusu dikey asimptottur.'
              }
            ],
            notes: [
              '$+\\infty$ ve $-\\infty$ birer sayı değildir; fonksiyonun sınırsız büyüme davranışını temsil eder.',
              'Sağ limit $+\\infty$ ve sol limit $-\\infty$ ise iki taraflı limit "Yoktur (DNE)" şeklinde ifade edilir.'
            ],
            examples: [
              {
                id: 'ex-inf-1',
                title: 'Örnek 1: Dikey Asimptot ve Tek Taraflı Sonsuz Limit',
                question: '$f(x) = \\displaystyle \\frac{2}{x - 3}$ için $\\displaystyle \\lim_{x \\to 3^+} f(x)$ ve $\\displaystyle \\lim_{x \\to 3^-} f(x)$ limitlerini hesaplayınız.',
                hint: '$x \\to 3^+$ için $x > 3$ (payda pozitif), $x \\to 3^-$ için $x < 3$ (payda negatif) olur.',
                steps: [
                  {
                    title: 'Adım 1: Sağdan yaklaşım (x -> 3+)',
                    content: 'Pay sabit pozitif ($2$), payda pozitif sıfıra yaklaşır ($0^+$):\n$$\\lim_{x \\to 3^+} \\frac{2}{x - 3} = \\frac{2}{0^+} = +\\infty$$'
                  },
                  {
                    title: 'Adım 2: Soldan yaklaşım (x -> 3-)',
                    content: 'Pay pozitif ($2$), payda negatif sıfıra yaklaşır ($0^-$):\n$$\\lim_{x \\to 3^-} \\frac{2}{x - 3} = \\frac{2}{0^-} = -\\infty$$'
                  },
                  {
                    title: 'Adım 3: Yorum',
                    content: 'Sağ ve sol limitler farklı sonsuzlara gittiği için iki taraflı limit yoktur (DNE). $x = 3$ doğrusu dikey asimptottur.'
                  }
                ],
                answer: '$\\lim_{x \\to 3^+} f(x) = +\\infty, \\quad \\lim_{x \\to 3^-} f(x) = -\\infty$'
              }
            ],
            quiz: {
              question: '$\\displaystyle \\lim_{x \\to 5^+} \\frac{x - 7}{x - 5}$ limitinin değeri nedir?',
              options: ['$-\\infty$', '$+\\infty$', '0', 'Yoktur (DNE)'],
              correctIndex: 0,
              explanation: 'Pay $5 - 7 = -2$ (negatif), payda ise $x > 5$ olduğundan $0^+$ (pozitif). Negatif / pozitif sıfır $= -\\infty$ olur.'
            }
          },
          {
            id: 'continuity',
            weekId: 'week-3',
            topicNum: '3.2',
            title: 'Süreklilik ve Süreksizlik Türleri',
            subTitle: 'Continuity & Types of Discontinuities',
            sourceUrl: 'https://tutorial.math.lamar.edu/Classes/CalcI/Continuity.aspx',
            readTime: '14 dk',
            overview: 'Sezgisel olarak süreklilik, bir fonksiyonun grafiğini kalemi kağıttan kaldırmadan çizebilmektir. Matematiksel olarak bir noktada süreklilik için 3 altın şartın aynı anda sağlanması gerekir.',
            keyFormulas: [
              {
                label: 'Sürekliliğin 3 Altın Şartı',
                latex: 'f(x), x=c \\text{ noktasında süreklidir } \\iff \\begin{cases} 1.\\; f(c) \\text{ tanımlı olmalı} \\\\ 2.\\; \\lim_{x \\to c} f(x) \\text{ var olmalı} \\\\ 3.\\; \\lim_{x \\to c} f(x) = f(c) \\text{ olmalı} \\end{cases}',
                desc: 'Bu şartlardan biri bile bozulursa fonksiyon x = c noktasında süreksizdir.'
              },
              {
                label: 'Ara Değer Teoremi (IVT)',
                latex: 'f \\in C[a, b] \\text{ ve } M \\in (f(a), f(b)) \\implies \\exists c \\in (a, b): f(c) = M',
                desc: 'Kapalı aralıkta sürekli bir fonksiyon, uç değerler arasındaki tüm ara değerleri en az bir kez alır.'
              }
            ],
            notes: [
              'Kaldırılabilir Süreksizlik (Removable): Limit vardır ancak $f(c)$ değerine eşit değildir (delikli grafik).',
              'Sıçrama Süreksizliği (Jump): Sağ ve sol limitler sonlu fakat birbirinden farklıdır.',
              'Sonsuz Süreksizlik (Infinite): Fonksiyon o noktada dikey asimptota sahiptir.'
            ],
            examples: [
              {
                id: 'ex-cont-1',
                title: 'Örnek 1: Parçalı Fonksiyonda Süreklilik',
                question: '$f(x) = \\displaystyle \\begin{cases} x^2 - 1, & x < 3 \\\\ 2x + 2, & x \\ge 3 \\end{cases}$ fonksiyonu $x = 3$ noktasında sürekli midir?',
                hint: 'Üç şartı test edin: 1) $f(3)$ tanımlı mı? 2) $\\lim_{x \\to 3} f(x)$ var mı? 3) Eşitler mi?',
                steps: [
                  {
                    title: 'Adım 1: Fonksiyon değerini bulalım',
                    content: '$x = 3$ için $2x + 2$ kuralı geçerlidir: $f(3) = 2(3) + 2 = 8$.'
                  },
                  {
                    title: 'Adım 2: Sağ ve sol limitleri inceleyelim',
                    content: 'Soldan: $\\lim_{x \\to 3^-} (x^2 - 1) = 3^2 - 1 = 8$\nSağdan: $\\lim_{x \\to 3^+} (2x + 2) = 2(3) + 2 = 8$\nHer iki limit eşit olduğundan $\\lim_{x \\to 3} f(x) = 8$.'
                  },
                  {
                    title: 'Adım 3: Karşılaştıralım',
                    content: '$\\lim_{x \\to 3} f(x) = 8 = f(3)$ olduğundan fonksiyon $x = 3$ noktasında süreklidir.'
                  }
                ],
                answer: 'Evet, $x = 3$ noktasında süreklidir.'
              }
            ],
            quiz: {
              question: '$f(x) = \\displaystyle \\frac{x^2 - 9}{x - 3}$ fonksiyonunun $x = 3$ noktasındaki süreksizlik türü nedir?',
              options: [
                'Kaldırılabilir (Removable) Süreksizlik',
                'Sıçrama (Jump) Süreksizliği',
                'Sonsuz (Infinite) Süreksizlik',
                'Süreklidir'
              ],
              correctIndex: 0,
              explanation: 'Çünkü $\\lim_{x \\to 3} \\frac{(x-3)(x+3)}{x-3} = 6$ limiti mevcuttur; sadece $f(3)$ tanımsızdır. Tek bir nokta eklenerek giderilebilir.'
            }
          },
          {
            id: 'limits-at-infinity',
            weekId: 'week-3',
            topicNum: '3.3',
            title: 'Sonsuzdaki Limitler ve Yatay Asimptotlar',
            subTitle: 'Limits at Infinity & Horizontal Asymptotes',
            sourceUrl: 'https://tutorial.math.lamar.edu/Classes/CalcI/LimitsAtInfinityI.aspx',
            readTime: '15 dk',
            overview: '$x$ sayısı sonsuza ($x \\to \\infty$) veya eksi sonsuza ($x \\to -\\infty$) sınırsız büyüdüğünde fonksiyonun nasıl davrandığını inceleriz. Bu limitler fonksiyonun yatay asimptotlarını (horizontal asymptotes) verir.',
            keyFormulas: [
              {
                label: 'Temel Sonsuzdaki Limit Özelliği',
                latex: 'r > 0 \\implies \\lim_{x \\to \\pm\\infty} \\frac{1}{x^r} = 0',
                desc: 'Payda sonsuza giderken terim sıfıra yaklaşır.'
              },
              {
                label: 'Yatay Asimptot Tanımı',
                latex: 'y = L \\text{ yatay asimptottur } \\iff \\lim_{x \\to \\infty} f(x) = L \\;\\text{ veya }\\; \\lim_{x \\to -\\infty} f(x) = L',
                desc: 'Eğri sonsuza giderken y = L doğrusuna yaklaşır.'
              }
            ],
            notes: [
              'Dereceler eşitse limit başkatsayıların oranıdır ($a_n / b_m$).',
              'Payın derecesi küçükse limit daima 0\'dır ($y = 0$ yatay asimptot).'
            ],
            examples: [
              {
                id: 'ex-inf-lim-1',
                title: 'Örnek 1: Eşit Dereceli Polinomların Oranı',
                question: '$\\displaystyle \\lim_{x \\to \\infty} \\frac{3x^2 - 5x + 4}{2x^2 + 7}$ limitini hesaplayınız.',
                hint: 'Pay ve paydayı en büyük derece olan $x^2$\'ye bölün.',
                steps: [
                  {
                    title: 'Adım 1: x^2 ile bölelim',
                    content: '$$\\frac{3 - \\frac{5}{x} + \\frac{4}{x^2}}{2 + \\frac{7}{x^2}}$$'
                  },
                  {
                    title: 'Adım 2: Limiti alalım',
                    content: '$x \\to \\infty$ iken $\\frac{5}{x} \\to 0$, $\\frac{4}{x^2} \\to 0$ ve $\\frac{7}{x^2} \\to 0$ olur:\n$$\\lim_{x \\to \\infty} = \\frac{3 - 0 + 0}{2 + 0} = \\frac{3}{2}$$\nYatay asimptot $y = \\frac{3}{2}$ doğrusudur.'
                  }
                ],
                answer: '$\\frac{3}{2}$'
              }
            ],
            quiz: {
              question: '$\\displaystyle \\lim_{x \\to \\infty} \\frac{5x^3 - 2}{x^4 + 10x}$ limitinin değeri kaçtır?',
              options: ['0', '5', '$\\infty$', 'Tanımsız'],
              correctIndex: 0,
              explanation: 'Paydanın derecesi (4), payın derecesinden (3) büyük olduğu için limit 0\'dır ($y = 0$ yatay asimptottur).'
            }
          }
        ]
      }
    ]
  };

  window.CALCULUS_STUDY_DATA = Object.freeze(CALCULUS_STUDY_DATA);
})();
