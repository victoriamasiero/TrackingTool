'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

parasails.registerComponent('ajaxForm', {

  props: ['syncing', // « 2-way bound (.sync)
  'cloudError', // « 2-way bound (.sync)
  'action', 'formErrors', // « 2-way bound (.sync)
  'formData', 'formRules', 'handleSubmitting', // « alternative for `action`
  'handleParsing'],

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function data() {
    return {
      //…
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: '\n  <form class="ajax-form" @submit.prevent="submit()">\n    <slot name="default"></slot>\n  </form>\n  ',

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function beforeMount() {
    //…
  },
  mounted: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var SUPPORTED_RULES, fieldName, ruleName, kebabRules, lowerCaseRules, ruleIdx;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(this.action === undefined && this.handleSubmitting === undefined)) {
                _context.next = 4;
                break;
              }

              throw new Error('Neither `:action` nor `:handle-submitting` was passed in to <ajax-form>, but one or the other must be provided.');

            case 4:
              if (!(this.action !== undefined && this.handleSubmitting !== undefined)) {
                _context.next = 8;
                break;
              }

              throw new Error('Both `:action` AND `:handle-submitting` were passed in to <ajax-form>, but only one or the other should be provided.');

            case 8:
              if (!(this.action !== undefined && (!_.isString(this.action) || !_.isFunction(Cloud[_.camelCase(this.action)])))) {
                _context.next = 12;
                break;
              }

              throw new Error('Invalid `action` in <ajax-form>.  `action` should be the name of a method on the `Cloud` global.  For example: `action="login"` would make this form communicate using `Cloud.login()`, which corresponds to the "login" action on the server.');

            case 12:
              if (!(this.action !== undefined && !_.isFunction(Cloud[this.action]))) {
                _context.next = 16;
                break;
              }

              throw new Error('Unrecognized `action` in <ajax-form>.  Did you mean to type `action="' + _.camelCase(this.action) + '"`?  (<ajax-form> expects `action` to be provided in camelCase format.  In other words, to reference the action at "api/controllers/foo/bar/do-something", use `action="doSomething"`.)');

            case 16:
              if (!(this.handleSubmitting !== undefined && !_.isFunction(this.handleSubmitting))) {
                _context.next = 18;
                break;
              }

              throw new Error('Invalid `:handle-submitting` function passed to <ajax-form>.  For example: `:handle-submitting="handleSubmittingSomeForm"`.  This function should be an `async function`, and it should either throw a special exit signal or return response data from the server.  (If this custom `handleSubmitting` will be doing something more complex than a single request to a server, feel free to return whatever amalgamation of data you wish.)');

            case 18:
              if (!(this.handleParsing === undefined && this.formData === undefined)) {
                _context.next = 22;
                break;
              }

              throw new Error('Neither `:form-data` nor `:handle-parsing` was passed in to <ajax-form>, but one or the other must be provided.');

            case 22:
              if (!(this.handleParsing !== undefined && this.formData !== undefined)) {
                _context.next = 26;
                break;
              }

              throw new Error('Both `:form-data` AND `:handle-parsing` were passed in to <ajax-form>, but only one or the other should be provided.');

            case 26:
              if (!(this.handleParsing !== undefined && !_.isFunction(this.handleParsing))) {
                _context.next = 30;
                break;
              }

              throw new Error('Invalid `:handle-parsing` function passed to <ajax-form>.  For example: `:handle-parsing="handleParsingSomeForm"`.  This function should return a dictionary (plain JavaScript object like `{}`) of parsed form data, ready to be sent in a request to the server.');

            case 30:
              if (!(this.formData !== undefined && (!_.isObject(this.formData) || _.isFunction(this.formData) || _.isArray(this.formData)))) {
                _context.next = 32;
                break;
              }

              throw new Error('Invalid `:form-data` passed to <ajax-form>.  For example: `:form-data="someFormData"`.  This should reference a dictionary (plain JavaScript object like `{}`).  Specifically, `:form-data` should only be used in the case where the raw data from the form in the user interface happens to correspond **EXACTLY** with the names and format of the argins that should be sent in a request to the server.  (For more nuanced behavior, use `handle-parsing` instead!)');

            case 32:
              if (!(!this.formData && (this.formRules || this.formErrors))) {
                _context.next = 36;
                break;
              }

              throw new Error('If `:form-rules` or `:form-errors.sync` are in use, then `:form-data` must also be passed in.  (If the AJAX request doesn\'t need form data, then use an empty dictionary, i.e. `:form-data="{}"`.)');

            case 36:
              if (!(this.formRules && !this.formErrors)) {
                _context.next = 38;
                break;
              }

              throw new Error('If `:form-rules` are provided, then `:form-errors.sync` must also be passed in.');

            case 38:
              if (!this.formRules) {
                _context.next = 61;
                break;
              }

              SUPPORTED_RULES = ['required', 'isEmail', 'isIn', 'is', 'minLength', 'maxLength', 'sameAs', 'isHalfwayDecentPassword', 'custom'];
              _context.t0 = regeneratorRuntime.keys(this.formRules);

            case 41:
              if ((_context.t1 = _context.t0()).done) {
                _context.next = 61;
                break;
              }

              fieldName = _context.t1.value;
              _context.t2 = regeneratorRuntime.keys(this.formRules[fieldName]);

            case 44:
              if ((_context.t3 = _context.t2()).done) {
                _context.next = 59;
                break;
              }

              ruleName = _context.t3.value;

              if (!_.contains(SUPPORTED_RULES, ruleName)) {
                _context.next = 49;
                break;
              }

              _context.next = 57;
              break;

            case 49:
              kebabRules = _.map(_.clone(SUPPORTED_RULES), function (ruleName) {
                return _.kebabCase(ruleName);
              });
              lowerCaseRules = _.map(_.clone(SUPPORTED_RULES), function (ruleName) {
                return ruleName.toLowerCase();
              });
              ruleIdx = _.indexOf(kebabRules, ruleName) === -1 ? _.indexOf(lowerCaseRules, ruleName.toLowerCase()) === -1 ? -1 : _.indexOf(lowerCaseRules, ruleName.toLowerCase()) : _.indexOf(kebabRules, ruleName);

              if (!(ruleIdx !== -1)) {
                _context.next = 56;
                break;
              }

              throw new Error('Did you mean `' + SUPPORTED_RULES[ruleIdx] + '`?  (note the capitalization)\nYou are seeing this error because <ajax-form> encountered an unsupported (but vaguely familiar-looking) client-side validation rule: `' + ruleName + '`.');

            case 56:
              throw new Error('<ajax-form> does not support that client-side validation rule (`' + ruleName + '`).\n [?] If you\'re unsure, visit https://sailsjs.com/support');

            case 57:
              _context.next = 44;
              break;

            case 59:
              _context.next = 41;
              break;

            case 61:

              // Focus our "focus-first" field, if relevant.
              // (but not on mobile, because it can get weird)
              if (typeof bowser !== 'undefined' && !bowser.mobile && this.$find('[focus-first]').length > 0) {
                this.$focus('[focus-first]');
              }

            case 62:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function mounted() {
      return _ref.apply(this, arguments);
    }

    return mounted;
  }(),
  beforeDestroy: function beforeDestroy() {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    submit: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var argins, formData, formErrors, fieldName, fieldValue, ruleName, ruleRhs, violation, isFieldValuePresent, otherFieldName, otherFieldValue, failedWithCloudExit, rawErrorFromCloudSDK, result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this.syncing) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt('return');

              case 2:
                //•

                // Clear the userland "cloudError" prop.
                this.$emit('update:cloudError', '');

                // Determine the argins that will be sent to the server in our request.

                if (!this.handleParsing) {
                  _context2.next = 13;
                  break;
                }

                // Run the provided "handle-parsing" logic.
                // > This should clear out any pre-existing error messages, perform any additional
                // > client-side form validation checks, and do any necessary data transformations
                // > to munge the form data into the format expected by the server.
                argins = this.handleParsing();

                if (!(argins === undefined)) {
                  _context2.next = 9;
                  break;
                }

                return _context2.abrupt('return');

              case 9:
                if (!(!_.isObject(argins) || _.isArray(argins) || _.isFunction(argins))) {
                  _context2.next = 11;
                  break;
                }

                throw new Error('Invalid data returned from custom form parsing logic.  (Should return a dictionary of argins, like `{}`.)');

              case 11:
                _context2.next = 79;
                break;

              case 13:
                if (!this.formData) {
                  _context2.next = 79;
                  break;
                }

                // Or use the simpler, built-in absorbtion strategy.
                // > This uses the provided form data as our argins, verbatim.  Then it runs
                // > built-in client-side validation, if configured to do so.
                argins = this.formData;

                formData = this.formData;
                formErrors = {};
                _context2.t0 = regeneratorRuntime.keys(this.formRules);

              case 18:
                if ((_context2.t1 = _context2.t0()).done) {
                  _context2.next = 76;
                  break;
                }

                fieldName = _context2.t1.value;
                fieldValue = formData[fieldName];
                _context2.t2 = regeneratorRuntime.keys(this.formRules[fieldName]);

              case 22:
                if ((_context2.t3 = _context2.t2()).done) {
                  _context2.next = 74;
                  break;
                }

                ruleName = _context2.t3.value;
                ruleRhs = this.formRules[fieldName][ruleName];
                violation = void 0;
                isFieldValuePresent = fieldValue !== undefined && fieldValue !== '' && !_.isNull(fieldValue);

                if (!(ruleName === 'required' && (ruleRhs === true || ruleRhs === false))) {
                  _context2.next = 31;
                  break;
                }

                // ® Must be defined, non-null, and not the empty string
                if (ruleRhs === false) {
                  violation = false;
                } else {
                  violation = !isFieldValuePresent;
                }
                _context2.next = 69;
                break;

              case 31:
                if (isFieldValuePresent) {
                  _context2.next = 34;
                  break;
                }

                _context2.next = 69;
                break;

              case 34:
                if (!(ruleName === 'isEmail' && (ruleRhs === true || ruleRhs === false))) {
                  _context2.next = 38;
                  break;
                }

                // ® Must be an email address (unless falsy)
                if (ruleRhs === false) {
                  violation = false;
                } else {
                  violation = !parasails.util.isValidEmailAddress(fieldValue);
                }
                _context2.next = 69;
                break;

              case 38:
                if (!(ruleName === 'isIn' && _.isArray(ruleRhs))) {
                  _context2.next = 42;
                  break;
                }

                // ® Must be one of these things
                violation = !_.contains(ruleRhs, fieldValue);
                _context2.next = 69;
                break;

              case 42:
                if (!(ruleName === 'is')) {
                  _context2.next = 46;
                  break;
                }

                // ® Must be exactly this thing (useful for required checkboxes)
                violation = ruleRhs !== fieldValue;
                _context2.next = 69;
                break;

              case 46:
                if (!(ruleName === 'minLength' && _.isNumber(ruleRhs))) {
                  _context2.next = 50;
                  break;
                }

                // ® Must consist of at least this many characters
                violation = !_.isString(fieldValue) || fieldValue.length < ruleRhs;
                _context2.next = 69;
                break;

              case 50:
                if (!(ruleName === 'maxLength' && _.isNumber(ruleRhs))) {
                  _context2.next = 54;
                  break;
                }

                // ® Must consist of no more than this many characters
                violation = !_.isString(fieldValue) || fieldValue.length > ruleRhs;
                _context2.next = 69;
                break;

              case 54:
                if (!(ruleName === 'sameAs' && ruleRhs !== '' && _.isString(ruleRhs))) {
                  _context2.next = 60;
                  break;
                }

                // ® Must match the value in another field
                otherFieldName = ruleRhs;
                otherFieldValue = formData[otherFieldName];

                violation = otherFieldValue !== fieldValue;
                _context2.next = 69;
                break;

              case 60:
                if (!(ruleName === 'isHalfwayDecentPassword' && (ruleRhs === true || ruleRhs === false))) {
                  _context2.next = 64;
                  break;
                }

                // ® Must be a halfway-decent password
                // > This is an arbitrary distinction, so change it if you want.
                // > Just... please use common sense.  And try to avoid engaging
                // > in security theater.
                if (ruleRhs === false) {
                  violation = false;
                } else {
                  violation = !_.isString(fieldValue) && !_.isNumber(fieldValue) || fieldValue.length < 6;
                }
                _context2.next = 69;
                break;

              case 64:
                if (!(ruleName === 'custom' && _.isFunction(ruleRhs))) {
                  _context2.next = 68;
                  break;
                }

                // ® Provided function must return truthy when invoked with the value.
                try {
                  violation = !ruleRhs(fieldValue);
                } catch (err) {
                  console.warn(err);
                  violation = true;
                }
                _context2.next = 69;
                break;

              case 68:
                throw new Error('Cannot interpret client-side validation rule (`' + ruleName + '`) because the configuration provided for it is not recognized by <ajax-form>.\n [?] If you\'re unsure, visit https://sailsjs.com/support');

              case 69:
                if (!violation) {
                  _context2.next = 72;
                  break;
                }

                formErrors[fieldName] = ruleName;
                return _context2.abrupt('break', 74);

              case 72:
                _context2.next = 22;
                break;

              case 74:
                _context2.next = 18;
                break;

              case 76:
                //∞

                // Whether there are any errors or not, update userland "formErrors" prop
                // so that the markup reflects the new reality (i.e. inline validation errors
                // either get rendered or go away.)
                this.$emit('update:formErrors', formErrors);

                // If there were any form errors, avast.  (Submission will not be attempted.)

                if (!(Object.keys(formErrors).length > 0)) {
                  _context2.next = 79;
                  break;
                }

                return _context2.abrupt('return');

              case 79:
                //ﬁ  (determining argins)


                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                // FUTURE: Potentially filter unused data in argins here before proceeding
                // (assuming cloudsdk has that information available)
                // Or better yet, just have `Cloud.*.with()` take care of that automatically.
                // console.log('about to send argins:',argins);
                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

                // Set syncing state to `true` on userland "syncing" prop.
                this.$emit('update:syncing', true);

                // Submit the form

                if (!this.handleSubmitting) {
                  _context2.next = 105;
                  break;
                }

                _context2.prev = 81;
                _context2.next = 84;
                return this.handleSubmitting(argins);

              case 84:
                result = _context2.sent;
                _context2.next = 103;
                break;

              case 87:
                _context2.prev = 87;
                _context2.t4 = _context2['catch'](81);

                rawErrorFromCloudSDK = _context2.t4;

                if (!_.isString(_context2.t4)) {
                  _context2.next = 94;
                  break;
                }

                failedWithCloudExit = _context2.t4 || 'error';
                _context2.next = 103;
                break;

              case 94:
                if (!_.isError(_context2.t4)) {
                  _context2.next = 98;
                  break;
                }

                failedWithCloudExit = _context2.t4.exit || 'error';
                _context2.next = 103;
                break;

              case 98:
                if (!_.isObject(_context2.t4)) {
                  _context2.next = 102;
                  break;
                }

                failedWithCloudExit = Object.keys(_context2.t4)[0] || 'error';
                _context2.next = 103;
                break;

              case 102:
                throw _context2.t4;

              case 103:
                _context2.next = 108;
                break;

              case 105:
                _context2.next = 107;
                return Cloud[this.action].with(argins).tolerate(function (err) {
                  rawErrorFromCloudSDK = err;
                  failedWithCloudExit = err.exit || 'error';
                });

              case 107:
                result = _context2.sent;

              case 108:

                // When a cloud error occurs, tolerate it, but set the userland "cloudError"
                // prop accordingly.
                if (failedWithCloudExit) {
                  this.$emit('update:cloudError', failedWithCloudExit);
                }

                // Set syncing state to `false` on userland "syncing" prop.
                this.$emit('update:syncing', false);

                // If the server says we were successful, then emit the "submitted" event.
                if (!failedWithCloudExit) {
                  this.$emit('submitted', result);
                } else {
                  this.$emit('rejected', rawErrorFromCloudSDK);
                }

              case 111:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[81, 87]]);
      }));

      function submit() {
        return _ref2.apply(this, arguments);
      }

      return submit;
    }()

  }
});