const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '..');

test('Calculus I study data has valid schema, Paul\'s Math Notes links, and rich examples', () => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { runScripts: 'dangerously' });
  dom.window.eval(fs.readFileSync(path.join(root, 'calculus-study-data.js'), 'utf8'));

  const data = dom.window.CALCULUS_STUDY_DATA;
  assert(data, 'CALCULUS_STUDY_DATA must be defined');
  assert.equal(data.courseCode, 'MTH0101');
  assert(Array.isArray(data.weeks) && data.weeks.length >= 3, 'Must have at least 3 weeks of curriculum');

  let totalExamples = 0;
  for (const week of data.weeks) {
    assert(week.number >= 1, 'Week number must be valid');
    assert(Array.isArray(week.topics) && week.topics.length > 0, 'Each week must have topics');
    for (const topic of week.topics) {
      assert(topic.id, 'Topic must have an id');
      assert(topic.title, 'Topic must have a title');
      assert(topic.sourceUrl.startsWith('https://tutorial.math.lamar.edu'), 'Must link to Lamar University Paul\'s Math Notes');
      assert(Array.isArray(topic.keyFormulas) && topic.keyFormulas.length > 0, 'Topic must have formulas');
      assert(Array.isArray(topic.examples) && topic.examples.length > 0, 'Topic must have examples');
      for (const ex of topic.examples) {
        assert(ex.id, 'Example must have an id');
        assert(ex.question, 'Example must have question LaTeX');
        assert(Array.isArray(ex.steps) && ex.steps.length > 0, 'Example must have step-by-step solution');
        assert(ex.answer, 'Example must have final answer');
        totalExamples++;
      }
      assert(topic.quiz && Array.isArray(topic.quiz.options) && topic.quiz.options.length === 4, 'Topic must have 4-choice quiz');
    }
  }

  assert(totalExamples >= 10, 'Must have at least 10 worked examples across all topics');
  dom.window.close();
});

test('Calculus study mode interacts cleanly with DOM and local storage', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const dom = new JSDOM(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ''), {
    url: 'https://c4n3rr.github.io/anku-eee-materials/',
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });
  const w = dom.window;
  const ctx = dom.getInternalVMContext();
  const vm = require('vm');

  w.tailwind = {};
  w.matchMedia = () => ({ matches: false, addEventListener() {} });
  w.scrollTo = () => {};
  w.lucide = { createIcons() {} };
  w.renderMathInElement = () => {};

  for (const file of [
    'portal-security.js',
    'theme-init.js',
    'portal-config.js',
    'analytics-init.js',
    'calculus-study-data.js',
    'app.js'
  ]) {
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), ctx);
  }

  // Switch to study tab
  vm.runInContext('setCourseActiveTab("study")', ctx);
  assert.equal(vm.runInContext('activeCourseTab', ctx), 'study');

  // Toggle example solution (records viewed example and updates activity state)
  assert.equal(vm.runInContext('openStudyExamples.has("ex-tangent-1")', ctx), false);
  assert.equal(vm.runInContext('viewedStudyExamples.has("ex-tangent-1")', ctx), false);
  vm.runInContext('toggleStudyExample("ex-tangent-1")', ctx);
  assert.equal(vm.runInContext('openStudyExamples.has("ex-tangent-1")', ctx), true);
  assert.equal(vm.runInContext('viewedStudyExamples.has("ex-tangent-1")', ctx), true);
  assert.equal(w.localStorage.getItem('anku_study_viewed_examples_v1').includes('ex-tangent-1'), true);

  // Switch between 3 topic section tabs (theory, examples, quiz)
  assert.equal(vm.runInContext('activeStudySectionTab', ctx), 'theory');
  vm.runInContext('setStudySectionTab("examples")', ctx);
  assert.equal(vm.runInContext('activeStudySectionTab', ctx), 'examples');
  assert(vm.runInContext('studyScrollProgress["tangents-rates"]', ctx) >= 0.85);

  vm.runInContext('setStudySectionTab("quiz")', ctx);
  assert.equal(vm.runInContext('activeStudySectionTab', ctx), 'quiz');
  assert.equal(vm.runInContext('studyScrollProgress["tangents-rates"]', ctx), 1.0);

  // Answer quiz
  vm.runInContext('selectStudyQuizOption("tangents-rates", 0)', ctx);
  assert.equal(vm.runInContext('studyQuizAnswers["tangents-rates"]', ctx), 0);
  assert.equal(w.localStorage.getItem('anku_study_quiz_answers_v1').includes('tangents-rates'), true);

  // Dynamic progress verification
  const topicData = vm.runInContext('window.CALCULUS_STUDY_DATA.weeks[0].topics[0]', ctx);
  const progress = vm.runInContext(`getTopicProgress(${JSON.stringify(topicData)})`, ctx);
  assert(progress >= 0.8, 'Progress should reach at least 80% with scroll, viewed example, and answered quiz');
  const isDone = vm.runInContext(`isTopicCompleted(${JSON.stringify(topicData)})`, ctx);
  assert.equal(isDone, true);

  // Navigate to next topic
  vm.runInContext('navigateStudyTopic(1)', ctx);
  assert.equal(vm.runInContext('activeStudyTopicId', ctx), 'the-limit');

  // Toggle curriculum sidebar rail (collapsible)
  assert.equal(vm.runInContext('isStudyNavCollapsed', ctx), false);
  vm.runInContext('toggleStudyNav()', ctx);
  assert.equal(vm.runInContext('isStudyNavCollapsed', ctx), true);
  vm.runInContext('toggleStudyNav()', ctx);
  assert.equal(vm.runInContext('isStudyNavCollapsed', ctx), false);

  // Return to home page (ANKU EEE Portal logo / brand button)
  vm.runInContext('goHome()', ctx);
  assert.equal(vm.runInContext('activeView', ctx), 'home');
  assert.equal(vm.runInContext('activeCourseId', ctx), null);

  dom.window.close();
});

test('Calculus study mode preserves active course tab, topic and section across page reload and tab toggle', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const dom = new JSDOM(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ''), {
    url: 'https://c4n3rr.github.io/anku-eee-materials/',
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });
  const w = dom.window;
  const ctx = dom.getInternalVMContext();
  const vm = require('vm');

  w.tailwind = {};
  w.matchMedia = () => ({ matches: false, addEventListener() {} });
  w.scrollTo = () => {};
  w.lucide = { createIcons() {} };
  w.renderMathInElement = () => {};

  for (const file of [
    'portal-security.js',
    'theme-init.js',
    'portal-config.js',
    'analytics-init.js',
    'calculus-study-data.js',
    'app.js'
  ]) {
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), ctx);
  }

  // 1. Select MTH0101 and switch to study tab
  vm.runInContext('selectCourseByCode("MTH0101")', ctx);
  vm.runInContext('setCourseActiveTab("study")', ctx);
  assert.equal(vm.runInContext('activeCourseTab', ctx), 'study');

  // 2. Select topic 2.1 (limit-properties) and section "examples"
  vm.runInContext('selectStudyTopic("limit-properties")', ctx);
  vm.runInContext('setStudySectionTab("examples")', ctx);
  assert.equal(vm.runInContext('activeStudyTopicId', ctx), 'limit-properties');
  assert.equal(vm.runInContext('activeStudySectionTab', ctx), 'examples');
  assert.equal(w.localStorage.getItem('anku_study_active_topic_id_v1'), 'limit-properties');
  assert.equal(w.localStorage.getItem('anku_study_active_section_tab_v1'), 'examples');
  assert.equal(w.localStorage.getItem('anku_course_tab_MTH0101_v1'), 'study');
  assert(w.location.hash.includes('limit-properties'));

  // 3. Switch to materials tab
  vm.runInContext('setCourseActiveTab("materials")', ctx);
  assert.equal(vm.runInContext('activeCourseTab', ctx), 'materials');

  // 4. Click back to "Adım Adım Öğren" - must NOT restart from 1.1, must stay on limit-properties & examples
  vm.runInContext('setCourseActiveTab("study")', ctx);
  assert.equal(vm.runInContext('activeCourseTab', ctx), 'study');
  assert.equal(vm.runInContext('activeStudyTopicId', ctx), 'limit-properties');
  assert.equal(vm.runInContext('activeStudySectionTab', ctx), 'examples');

  // 5. Simulate page reload (syncCourseFromHash with #MTH0101)
  w.location.hash = '#MTH0101';
  vm.runInContext('syncCourseFromHash()', ctx);
  assert.equal(vm.runInContext('activeCourseTab', ctx), 'study', 'Reload should stay in study mode');
  assert.equal(vm.runInContext('activeStudyTopicId', ctx), 'limit-properties', 'Reload should stay on topic 2.1');
  assert.equal(vm.runInContext('activeStudySectionTab', ctx), 'examples', 'Reload should stay on examples section');

  // 6. Test direct deep link hash #MTH0101:study:infinite-limits:quiz
  w.location.hash = '#MTH0101:study:infinite-limits:quiz';
  vm.runInContext('syncCourseFromHash()', ctx);
  assert.equal(vm.runInContext('activeCourseTab', ctx), 'study');
  assert.equal(vm.runInContext('activeStudyTopicId', ctx), 'infinite-limits');
  assert.equal(vm.runInContext('activeStudySectionTab', ctx), 'quiz');

  dom.window.close();
});
