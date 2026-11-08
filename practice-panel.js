(() => {
  const escape = value => String(value).replace(/[&<>"']/g, char =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

  function renderFigure(figure) {
    const x = value => 56 + 396 * value / figure.xTicks.at(-1);
    const min = figure.yTicks[0];
    const max = figure.yTicks.at(-1);
    const y = value => 198 - 166 * (value - min) / (max - min);
    const lines = figure.segments.map(points =>
      '<polyline class="practice-plot" points="' + points.map(([t, v]) => x(t) + ',' + y(v)).join(' ') + '"/>');
    const jumps = figure.segments.slice(1).map((points, index) => {
      const [t, v] = points[0];
      return '<path class="practice-jump" d="M' + x(t) + ' ' + y(figure.segments[index].at(-1)[1]) + 'V' + y(v) + '"/>';
    });
    const xGrid = figure.xTicks.map(t =>
      '<path d="M' + x(t) + ' 32V198"/><text x="' + x(t) + '" y="216" text-anchor="middle">' + t + '</text>');
    const yGrid = figure.yTicks.map(v =>
      '<path d="M56 ' + y(v) + 'H452"/><text x="47" y="' + (y(v) + 4) + '" text-anchor="end">' + v + '</text>');
    return '<figure class="practice-figure"><svg viewBox="0 0 480 244" role="img" aria-label="' + escape(figure.alt) +
      '"><g class="practice-grid">' + xGrid.join('') + yGrid.join('') + '</g><path class="practice-axis" d="M56 32V198H452 M56 ' +
      y(0) + 'H452"/>' + jumps.join('') + lines.join('') + '<text x="56" y="19">' + escape(figure.yLabel) +
      '</text><text x="452" y="237" text-anchor="end">t (s)</text></svg><figcaption>Şekil</figcaption></figure>';
  }

  window.mountPortalPractice = (panel, code, questions, renderMath) => {
    const key = 'anku_practice_choices_v1_' + code;
    let choices = {};
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      for (const question of questions) {
        const choice = saved?.[question.id];
        if (question.options.some(option => option.key === choice)) choices[question.id] = choice;
      }
    } catch {}
    panel.className = 'practice-panel';
    panel.innerHTML = '<header class="practice-header"><div><h2>Vize Çalışma Soruları</h2>' +
      '<p>Vize öncesi pratik için hazırlanmış çalışma soruları.</p></div><span class="practice-count">' +
      questions.length + ' soru</span></header><div class="practice-tools"><label><input type="checkbox" role="switch" data-reveal> Cevapları göster</label>' +
      '<button type="button" class="course-ghost practice-reset">Sıfırla</button></div>' +
      '<div class="practice-progress"><progress aria-label="Cevaplanan soru sayısı" max="' +
      questions.length + '" value="0"></progress><output aria-live="polite"></output></div>' +
      questions.map(question => {
        const id = 'practice-question-' + question.id;
        const options = question.options.map(option =>
          '<label class="practice-option"><input type="radio" name="' + id + '" value="' + option.key + '">' +
          '<span class="practice-key">' + option.key + '</span><span>' + escape(option.text) +
          '</span><span class="practice-feedback"></span></label>').join('');
        return '<article class="admincn-card practice-card" data-question="' + question.id + '">' +
          '<span class="practice-number">' + question.id + '</span><p id="' + id + '">' + escape(question.text) + '</p>' +
          (question.figure ? renderFigure(question.figure) : '') +
          (options ? '<div class="practice-options" role="radiogroup" aria-labelledby="' + id + '">' + options + '</div>' :
            '<p class="practice-tag">Şıklar eklenecek</p>') +
          (question.review ? '<p class="practice-tag">Şıklar kontrol edilecek</p>' : '') +
          '<div class="practice-answer" hidden>' + (!question.answer ? '<p class="practice-tag">Cevap eklenecek</p>' : '') +
          (question.expectedEquation ? '<p>' + escape(question.expectedEquation) + '</p>' : '') +
          (question.note ? '<p>' + escape(question.note) + '</p>' : '') + '</div></article>';
      }).join('');

    const reveal = panel.querySelector('[data-reveal]');
    const progress = panel.querySelector('progress');
    const count = panel.querySelector('output');
    function refresh() {
      progress.value = Object.keys(choices).length;
      count.textContent = progress.value + ' / ' + questions.length;
      for (const question of questions) {
        const card = panel.querySelector('[data-question="' + question.id + '"]');
        card.querySelector('.practice-answer').hidden = !reveal.checked;
        for (const radio of card.querySelectorAll('input[type="radio"]')) {
          const selected = choices[question.id] === radio.value;
          const correct = reveal.checked && question.answer === radio.value;
          const incorrect = reveal.checked && Boolean(question.answer) && selected && !correct;
          radio.checked = selected;
          radio.parentElement.classList.toggle('practice-correct', correct);
          radio.parentElement.classList.toggle('practice-incorrect', incorrect);
          radio.parentElement.querySelector('.practice-feedback').textContent =
            correct ? (selected ? '✓ Doğru cevap · Seçiminiz' : '✓ Doğru cevap') :
            incorrect ? '✕ Seçiminiz' : reveal.checked && selected ? 'Seçiminiz' : '';
        }
      }
    }
    panel.addEventListener('change', event => {
      const input = event.target;
      if (input.type === 'radio') {
        choices[input.closest('[data-question]').dataset.question] = input.value;
        try { localStorage.setItem(key, JSON.stringify(choices)); } catch {}
      }
      refresh();
    });
    panel.querySelector('.practice-reset').addEventListener('click', () => {
      choices = {};
      reveal.checked = false;
      try { localStorage.removeItem(key); } catch {}
      refresh();
    });
    refresh();
    renderMath(panel);
  };
})();
