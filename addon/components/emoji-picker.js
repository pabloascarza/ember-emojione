import Component from 'ember-component';
import computed from 'ember-computed';
import {htmlSafe} from 'ember-string';
import {debounce, next, throttle} from 'ember-runloop';
import layout from '../templates/components/emoji-picker';
import service from 'ember-service/inject';
import observer from 'ember-metal/observer';
import ClickOutsideMixin from 'ember-click-outside/mixins/click-outside';

import {A} from 'ember-array/utils';
import {default as EObject} from 'ember-object';
const  O = EObject.create.bind(EObject);

export default Component.extend(ClickOutsideMixin, {

  selectAction:     undefined,
  toneSelectAction: undefined,
  closeAction:      undefined,
  disableAutoFocus: false,
  textNoEmojiFound: "No emoji found.",
  textSearch:       "Search",
  textClearSearch:  "Clear search",



  emojiService: service('emoji'),



  layout,
  classNames:   ['eeo-emojiPicker'],
  _filterInput: '',
  filterInput: '',

  scrollableId: computed(function () {
    return Math.random().toString(36).substr(2, 5);
  }),

  $scrollable: computed(function () {
    return this.$('.eeo-emojiPicker-scrollable');
  }),

  categorySections: computed('emojiService.categories', function () {
    const objs =
      this
        .get('emojiService.categories')
        .map(category => O({
          category,
          style: htmlSafe("")
        }));

    return A(objs);
  }),

  emojiByCategoryIdFiltered: computed(
    'filterInput',
    'emojiService.currentSkinTone',
    'emojiService.categories.@each.id',

    'emojiService.people__tone_default',
    'emojiService.nature__tone_default',
    'emojiService.food__tone_default',
    'emojiService.activity__tone_default',
    'emojiService.travel__tone_default',
    'emojiService.objects__tone_default',
    'emojiService.symbols__tone_default',
    'emojiService.flags__tone_default',
    'emojiService.regional__tone_default',
    'emojiService.modifier__tone_default',

    'emojiService.people__tone_1',
    'emojiService.nature__tone_1',
    'emojiService.food__tone_1',
    'emojiService.activity__tone_1',
    'emojiService.travel__tone_1',
    'emojiService.objects__tone_1',
    'emojiService.symbols__tone_1',
    'emojiService.flags__tone_1',
    'emojiService.regional__tone_1',
    'emojiService.modifier__tone_1',

    'emojiService.people__tone_2',
    'emojiService.nature__tone_2',
    'emojiService.food__tone_2',
    'emojiService.activity__tone_2',
    'emojiService.travel__tone_2',
    'emojiService.objects__tone_2',
    'emojiService.symbols__tone_2',
    'emojiService.flags__tone_2',
    'emojiService.regional__tone_2',
    'emojiService.modifier__tone_2',

    'emojiService.people__tone_3',
    'emojiService.nature__tone_3',
    'emojiService.food__tone_3',
    'emojiService.activity__tone_3',
    'emojiService.travel__tone_3',
    'emojiService.objects__tone_3',
    'emojiService.symbols__tone_3',
    'emojiService.flags__tone_3',
    'emojiService.regional__tone_3',
    'emojiService.modifier__tone_3',

    'emojiService.people__tone_4',
    'emojiService.nature__tone_4',
    'emojiService.food__tone_4',
    'emojiService.activity__tone_4',
    'emojiService.travel__tone_4',
    'emojiService.objects__tone_4',
    'emojiService.symbols__tone_4',
    'emojiService.flags__tone_4',
    'emojiService.regional__tone_4',
    'emojiService.modifier__tone_4',

    'emojiService.people__tone_5',
    'emojiService.nature__tone_5',
    'emojiService.food__tone_5',
    'emojiService.activity__tone_5',
    'emojiService.travel__tone_5',
    'emojiService.objects__tone_5',
    'emojiService.symbols__tone_5',
    'emojiService.flags__tone_5',
    'emojiService.regional__tone_5',
    'emojiService.modifier__tone_5',

    function () {
      const currentSkinTone = this.get('emojiService.currentSkinTone');
      const filterInput     = this.get('filterInput');
      const filterStrs      = filterInput.length ? filterInput.split(' ') : null;

      return this
        .get('emojiService.categories')
        .reduce((result, category) => {
          const categoryId      = category.get('id');
          const emojiPropName   = `emojiService.${categoryId}__tone_${currentSkinTone}`;
          const emojiUnfiltered = this.get(emojiPropName);

          const emojiFiltered =
            filterStrs
            ? emojiUnfiltered.filter(emojo => filterStrs.every(str => emojo.filterable.indexOf(str) > -1))
            : emojiUnfiltered;

          result.set(categoryId, emojiFiltered);
          return result;
        }, O());
    }
  ),



  filteredEmojiCount: computed(
    'emojiByCategoryIdFiltered.people.length',
    'emojiByCategoryIdFiltered.nature.length',
    'emojiByCategoryIdFiltered.food.length',
    'emojiByCategoryIdFiltered.activity.length',
    'emojiByCategoryIdFiltered.travel.length',
    'emojiByCategoryIdFiltered.objects.length',
    'emojiByCategoryIdFiltered.symbols.length',
    'emojiByCategoryIdFiltered.flags.length',
    function () {
      return (
        this.get('emojiByCategoryIdFiltered.people.length')
        + this.get('emojiByCategoryIdFiltered.nature.length')
        + this.get('emojiByCategoryIdFiltered.food.length')
        + this.get('emojiByCategoryIdFiltered.activity.length')
        + this.get('emojiByCategoryIdFiltered.travel.length')
        + this.get('emojiByCategoryIdFiltered.objects.length')
        + this.get('emojiByCategoryIdFiltered.symbols.length')
        + this.get('emojiByCategoryIdFiltered.flags.length')
      );
    }
  ),



  _applyFilterInput(filterInput) {
    if (this.get('isDestroying') || this.get('isDestroyed')) return;

    this.setProperties({filterInput});
    next(() => this._updateScroll());
  },



  _applyFilterInputDebounced: observer('_filterInput', function () {
    const filterInput = this.get('_filterInput');
    debounce(this, this._applyFilterInput, filterInput, 200, false);
  }),



  _updateScroll() {
    if (this.get('isDestroying') || this.get('isDestroyed')) return;

    const $scrollable = this.get('$scrollable');
    const parHeight   = $scrollable.innerHeight();

    this
      .get('categorySections')
      .forEach(section => {
        const $category = this.$(`.eeo-emojiPicker-category._${section.category.get('id')} .eeo-emojiPicker-category-emoji`);

        if (!$category.length) {
          section.set('style', htmlSafe(''));
          return;
        }

        const catTop    = $category.position().top;
        const catHeight = $category.outerHeight();
        const catBottom = catTop + catHeight;
        const left      = (-catTop) / catHeight;
        const right     = (catBottom - parHeight) / catHeight;
        const style     = htmlSafe(`left: ${left  * 100}%; right: ${right * 100}%;`);

        section.setProperties({style});
      });
  },



  didInsertElement() {
    this._super(...arguments);

    this._updateScroll();

    this
      .$('.eeo-emojiPicker-scrollable')
      .on('scroll.eeo', () => throttle(this, this._updateScroll, 200, false));

    next(() => this.addClickOutsideListener());
  },



  willDestroyElement() {
    this._super(...arguments);

    this
      .$('.eeo-emojiPicker-scrollable')
      .off('scroll.eeo');

    this.removeClickOutsideListener();
  },



  clickOutside() {
    const closeAction = this.get('closeAction');
    if (closeAction) this.sendAction('closeAction');
  },



  actions: {
    inputFilteringText(_filterInput) {
      this.setProperties({_filterInput});
    }
  }
});
