
/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();


var JLSObject = Class.extend({
	init:function( opts ) {
		// set options
		for(opt in opts) {
			this[opt] = opts[opt];
		}
	},
	
	// 
	parent:null,
	//
	index:null,
	// display props
	onshow:null,
	onshowComplete:null,
	show: function() {
	},
	onhide:null,
	onhideComplete: null,
	hide: function() {
	}
})


/*JLSObject.prototype.onshow = null;
JLSObject.prototype.onshowComplete = null;
JLSObject.prototype.onhide = null;
JLSObject.prototype.onhideComplete = null;

JLSObject.prototype.parent = null; // parent element

JLSObject.prototype.show = function() {
	
}
JLSObject.prototype.hide = function() {
	
}
*/


function setOptions( ui, options ) {
	for(opt in options) {
		ui[opt] = options[opt];	
	}
}
function elementExists( options ) {
	if($('#'+options.id).length > 0) {
		return true;	
	} 
	return false;
}

// ============================================================
// BTN
//
var JLSBtn = JLSObject.extend(
{
	init:function( options ) 
	{
		var _btn = this;
		// set options
		_btn._super( options );
		
		if( elementExists( options )) {
			_btn.div = $('#'+options.id);
		} else {
			_btn.div = $('<div>')
				.appendTo($(options.parent));	
		}
		
		$(_btn.div)
			.data( 'owner', _btn )
			.addClass('JLSui-btn out '+(options.classes != null ? options.classes : ""))
			/*.css({ 
				"background-color":getCSS("background-color", "out")
			})*/
			.mouseover(function(e)
			{
				if(_btn.enabled) 
				{
					if(_btn.onmouseover != null) {
						 _btn.onmouseover(e);
					}
				}
			})
			.mouseout(function(e) {
				if(_btn.enabled) {
					if(_btn.onmouseout != null) {
						 _btn.onmouseout(e);
					}
				}
			})
			.mouseup(function(e) {
				if(_btn.enabled) {
					if(_btn.onmouseout != null) {
						 _btn.onmouseout(e);
					}	
				}
			})
			.click(function(e) {
				if(_btn.enabled) {
					if(_btn.onclick != null) {
						_btn.onclick(e);
					}
				}
			})
			
		if(options.icon) {
			_btn.icon = $('<img>')
				.addClass('icon')
				.appendTo( _btn.div )
				.attr( 'src', options.icon.src )
			
			if(options.icon.width) {
				$(_btn.div).css({
				//	width:options.icon.width
				})
				//$(_btn.div).width( options.icon.width );	
			}
			if(options.icon.height) {
				$(_btn.div).css({
				//	height:options.icon.height
				})
				//$(_btn.div).height( options.icon.height );	
			}
		}
			
			
		if(options.label) {
			_btn.label = $('<p>')
				.addClass( 'label' )
				.appendTo( _btn.div )	
				.html( options.label )
		}
		
		_btn.setEnabled( options.enabled ? options.enabled : true );
		
		_btn.setTitle( options.title ? options.title : "" );	
		
			
		return this;	
	}
})

// settings
JLSBtn.prototype.enabled = true;

// callbacks
JLSBtn.prototype.onclick = null;
JLSBtn.prototype.onmouseover = function(e) {
	if(this.enabled) {
		$(this.div)
			.removeClass('out')
			.addClass('over');
	}
	//TweenLite.to( $(this.div), .3, { css:{ 'background': getCSS('background-color', 'over') }});	
};
JLSBtn.prototype.onmouseout = function(e) {
	if(this.enabled) {
		$(this.div)
			.removeClass('over')
			.addClass('out');
	}
	//TweenLite.to( $(this.div), .3, { css:{ 'background-color':getCSS('background-color', 'out') }});		
};

// ------------------------------------
// ENABLE / DISABLE
// enables / disables the btn
//
JLSBtn.prototype.enable = function() {
	var _btn = this;
	_btn.enabled = true;
	$(_btn.div)
		.removeClass('disabled')
		.addClass('enabled');
		
	if(_btn.icon) 
		TweenLite.to( $(_btn.icon), .3, { css:{ opacity:1 }});
}
JLSBtn.prototype.disable = function() {
	var _btn = this;
	_btn.enabled = false;	
	$(_btn.div)
		.removeClass('enabled')
		.addClass('disabled');
		
	if(_btn.icon) 
		TweenLite.to( $(_btn.icon), .3, { css:{ opacity:.3 }});
}
JLSBtn.prototype.setEnabled = function( _enable ) {
	var _btn = this;
	_enable ? _btn.enable() : _btn.disable();
}

// ------------------------------------
// SET LABEL
// sets the label of the btn
//
JLSBtn.prototype.setLabel = function( _label ) {
	var _btn = this;
	$(_btn.label).html( _label );
}
// ------------------------------------
// SET ICON
// sets the icon of the btn
//
JLSBtn.prototype.setIcon = function( opts ) {
	var _btn = this;
	$(_btn.icon).attr( 'src', opts.src );
}
// ------------------------------------
// SET CSS
// sets the label of the btn
//
JLSBtn.prototype.setCSS = function( _css ) {
	var _btn = this;
	$(_btn.div).css( _css );
}
// ------------------------------------
// SET TITLE
// sets the title of the btn
//
JLSBtn.prototype.setTitle = function( _title ) {
	var _btn = this;
	$(_btn.div).attr( 'title', _title );
}
// ============================================================
// ============================================================
//
// TOGGLE
//
var JLSToggle = JLSBtn.extend(
{
	init:function( options ) 
	{
		var _t = this;
		// set options
		_t._super( options );
		
		$(_t.div).addClass( _t.toggled ? 'toggled' : 'out' );
		
		_t.toggled ? _t.toggleOn : _t.toggleOff();
	}
})

// settings vars
JLSToggle.prototype.toggled = false;

// callbacks
JLSToggle.prototype.onmouseover = function(e) {
	var _t = this;
	if(_t.enabled) {
		$(_t.div)
			.removeClass('over out toggled toggled-over')
			.addClass( _t.toggled ? 'toggled-over' : 'over');
	}
	//TweenLite.to( $(_toggle.div), .3, { css:{ 'background': getCSS('background-color', 'over') }});		
}
JLSToggle.prototype.onmouseout = function(e) {
	var _t = this;
	if(_t.enabled) {
		$(_t.div)
			.removeClass('over out toggled toggled-over')
			.addClass( _t.toggled ? 'toggled' : 'out');
	}
	//var _toggle = this;
	//TweenLite.to( $(_toggle.div), .3, { css:{ 'background': _toggle.toggled ? getCSS('background-color', 'on') : getCSS('background-color', 'out') }});	
}
	
JLSToggle.prototype.ontoggle = function() {
	var _t = this;
	$(_t.div)
		.removeClass('over out toggled toggled-over')
		.addClass(_t.toggled ? 'toggled' : 'out' );
	
	//TweenLite.to( $(_toggle.div), .3, { css:{ 'background': _toggle.toggled ? getCSS('background-color', 'on') : getCSS('background-color', 'out') }});	
};

// ------------------------------------
// TOGGLE
// toggles button on & off
//
JLSToggle.prototype.toggle = function() {
	var _t = this;
	_t.toggled = !_t.toggled;
	if(_t.ontoggle) 
	{
		_t.ontoggle();		
	}
}
JLSToggle.prototype.toggleOn = function() {
	var _t = this;
	_t.toggled = true;
	if(_t.ontoggle) 
	{
		_t.ontoggle();		
	}
}
JLSToggle.prototype.toggleOff = function() {
	var _t = this;
	_t.toggled = false;
	if(_t.ontoggle) 
	{
		_t.ontoggle();		
	}
}

// ============================================================
// INPUT FIELD
//
// types: text, email, password, passwordOnEntry

var JLSInputField = JLSObject.extend(
{
	init:function( options ) 
	{
		var _if = this;
		_if._super( options );
		
		
		// set options
		setOptions( _if, options );
		
		if( elementExists( options )) {
			_if.input = $('#'+options.id);
		} else {
			_if.input = $('<input>')
				.appendTo($(options.parent));	
		}
		
		$(_if.input)
			.addClass('JLSui-input-field default '+options.classes != null ? options.classes : "")
			.attr( 'type', _if.type )
			.attr( 'id', _if.id )
			.attr( 'size', _if.size )
			.attr( 'value',  options.value ? options.value : options.defaultVal )
			.attr( 'data-role', 'none' )
			.data( 'type', _if.type)
			.data( 'default', _if.defaultVal )
			.data( 'owner', _if )
			.val( options.defaultVal)
			.focus(function(e) {
				// if default, clear 
				if( _if.type != "number" ) {
					if($(this).val() == $(this).data('default')) {
						$(this).val("")
					}
				}
				
				// update field
				_if.update();
				
				// call callback
				if( _if.onfocus != null ) {
					_if.onfocus( _if );	
				}
			})
			.keyup(function(e) {
				if(e.which == 38) {
				}
				if(e.which == 40) {
				}
				// return key
				if(e.which == 13) {
					if( _if.onreturn != null) {
						_if.onreturn();	
					}
				}
				
				var _type = $(this).data('type');
				
				// get password strength
				/*if(_type == "password" || _type == "passwordOnEntry") {
					//_if.updatePasswordInputType();	
					
				}*/
				_if.update();
				
				if( _if.onkeyup ) {
					_if.onkeyup( _if );	
				}
			})
			.change(function(e) {
				if( _if.onchange ) {
					_if.onchange( e );	
				}
			})
			.blur(function(e) {
				// if empty, replace with default
				if($(this).val() == "") {
					$(this)
						.val($(this).data('default'))
				}
				// update field
				_if.update();
				
				// do callback
				if( _if.onblur ) {
					_if.onblur( _if );	
				}
			})
	
		
		_if.update();
	
		
		return this;
	}
})

// display settings
JLSInputField.prototype.type = "text";
JLSInputField.prototype.defaultVal = "";
JLSInputField.prototype.size = 50;
JLSInputField.prototype.showEmailValidationOutlines = true;

// callbacks
JLSInputField.prototype.onfocus = null;
JLSInputField.prototype.onkeyup = null;
JLSInputField.prototype.onblur = null;
JLSInputField.prototype.onreturn = null;
JLSInputField.prototype.onchange = null;

// ------------------------------------
// VAL
// get current value of input field
//
JLSInputField.prototype.val = function() {
	return $(this.input).val();	
}
// ------------------------------------
// SET VAL
// sets the current value of input field
//
JLSInputField.prototype.setVal = function( _val ) {
	$(this.input).val(_val);	
}
// ------------------------------------
// DEFAULT VAL
// get current value of input field
//
JLSInputField.prototype.getDefaultVal = function() {
	return $(this.input).data('default');	
}
// ------------------------------------
// VALIDATE FIELD
// validates the input of the field 
//
/*JLSInputField.prototype.isValid = function() {
	var _if = this;
	if( _if.val() == "" || _if.val() == _if.getDefaultVal()) {
		return false;
	}
}*/
// ------------------------------------
// CHECK BASIC ENTRY
// checks to see if text is empty or default
//
JLSInputField.prototype.checkBasicEntry = function() {
	var _if = this;
	return (_if.val() != "" && _if.val() != _if.getDefaultVal());
}

// ------------------------------------
// VALIDATE EMAIL
// validates the input of the field as being an email
//
JLSInputField.prototype.isEmailValid = function() {
	var _if = this;
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(_if.val())) {  
		return (true)  
  	}  
    return false;
}
// ------------------------------------
// CHECK PASSWORD STRENGTH
// checks the strength of the entered password
//
JLSInputField.prototype.passwordStrength = function() {
	var _if = this;
	
	var score = 0;
	
	//if password bigger than 6 give 1 point
	if(_if.val().length > 6) score++;
	
	//if password has both lower and uppercase characters give 1 point 
	if (( _if.val().match(/[a-z]/) ) && ( _if.val().match(/[A-Z]/) ) ) score++;
	
	//if password has at least one number give 1 point
	if(_if.val().match(/\d+/)) score++;
	
	//if password has at least one special caracther give 1 point
	if( _if.val().match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/) ) score++;
	
	//if password bigger than 12 give another 1 point
	if(_if.val().length > 12) score++;
	
	return score;
}
// ------------------------------------
// UPDATE
// updates the display of the field
//
JLSInputField.prototype.update = function() {
	var _if = this;
	var _input = _if.input;
	
	
	if(_if.val() == _if.getDefaultVal() || _if.val() == "") 
	{
		//if(!$(_input).hasClass('default')) {
			$(_input)
				.removeClass('populated')
				.addClass('default')	
		//	console.log("add populated");	
		//}
	} else {
		
		//if(!$(_input).hasClass('populated')) {
			$(_input)
				.removeClass('default')
				.addClass('populated')	
		//}
	}
	
	// email
	// validate email
	if(_if.type == "email") { 
		if(_if.showEmailValidationOutlines) {
			if(_if.isEmailValid()) {
				$(_input)
					.removeClass('invalid')
					.addClass('valid');	
			} else {
				$(_input)
					.removeClass('valid')
					.addClass('invalid');	
			}
		}
	}
	
	// password
	if(_if.type == 'password' || _if.type == 'passwordOnEntry') {
		//console.log(_if.passwordStrength());
		_if.updatePasswordInputType();				
	}
}

// ------------------------------------
// UPDATE INPUT TYPE
// for the 'passwordOnEntry' field, updates 'type' attribute of field
//
JLSInputField.prototype.updatePasswordInputType = function() {
	var _if = this;
	// if field is empty or default, display as regular text
	$(_if.input).attr( 'type', (_if.val() == "" || _if.val() == _if.getDefaultVal()) ? 'text' : 'password' );
}

// ____________________________________________________________
// ============================================================
// ALERT BAR
//
//
var JLSAlertBar = JLSObject.extend({
	init:function( options ) {
		var _bar = this;
		// set options
		this._super( options );
		
		if( elementExists( options )) {
			_bar.div = $('#'+options.id);
		} else {
			_bar.div = $('<div>')
				.appendTo($(options.parent));	
		}
	
		$(_bar.div)
			.addClass('JLSui-alert-bar')
			.attr('id', options.id )
			.data( 'owner', _bar );
			
		_bar.header = $( '<p>')
			.addClass( 'header')
			.appendTo( _bar.div)
			.html( options.title )
		
		_bar.subheader = $('<p>')
			.addClass( 'subheader')
			.appendTo( _bar.div)
			.html( options.message )
			
		_bar.actionArea = $('<div>')
			.addClass( 'action-area')
			.appendTo( _bar.div);
			
		// ok btn
		_bar.okBtn = new JLSBtn({
			classes:options.okBtn ? options.okBtn.classes != null ? options.okBtn.classes : "" : "",
			parent:_bar.actionArea,
			label:options.okBtn ? options.okBtn.title != null ? options.okBtn.title : "Ok" : "Ok",
			onclick:function() { 
				/*if(options.okBtn.onclick != null) { 
					options.okBtn.onclick();
				} else {
					_bar.hide()
				}*/
				if(_bar.onok) {
					_bar.onok();	
				} else {
					_bar.hide();
				}
			}
		})
		
		
			
		/*for(var i = 0; i < options.btns.length; i++) {
				
		}*/
	
		return this;	
	}
})

// regular settings
JLSAlertBar.prototype.removeAfterHiding = false;

// callback methods
JLSAlertBar.prototype.onshow = null;
JLSAlertBar.prototype.onshowComplete = null;
JLSAlertBar.prototype.onhide = null;
JLSAlertBar.prototype.onhideComplete = null;
JLSAlertBar.prototype.onok = null;

// display settings
JLSAlertBar.prototype.showDur = 400;
JLSAlertBar.prototype.hideDur = 400;

// ------------------------------------
// SET TITLE
// sets the title of the alert bar
//
JLSAlertBar.prototype.setTitle = function( _title ) { 
	var _bar = this;
	$(_bar.header).html( _title );
}

// ------------------------------------
// SET MESSAGE
// sets the message of the alert bar
//
JLSAlertBar.prototype.setMessage = function( _message ) { 
	var _bar = this;
	$(_bar.subheader).html( _message );
}
// ------------------------------------
// SET OK BTN LABEL
// sets the label of the ok btn
//
JLSAlertBar.prototype.setOkBtnLabel = function( _label ) { 
	var _bar = this;
	_bar.okBtn.setLabel( _label );
}

// ------------------------------------
// SHOW / HIDE ACTION AREA
// makes the action area visible
//
JLSAlertBar.prototype.showActionArea = function( animated ) {
	var _bar = this;
	if(animated) {
	} else {
		$(_bar.actionArea).css({
			'display':'block'
		})
	}
}
JLSAlertBar.prototype.hideActionArea = function( animated ) {
	var _bar = this;
	if(animated) {
	} else {
		$(_bar.actionArea).css({
			'display':'none'
		})
	}
}
// ------------------------------------
// SHOW
// shows the alert bar
//
JLSAlertBar.prototype.show = function( opts ) {
	var _bar = this;
	
	// show / hide action area
	if(!opts.showActionArea) {
		_bar.hideActionArea(false);
	} else {
		_bar.showActionArea(false);	
	}
	
	_bar.setTitle( opts.title ? opts.title : "Whoops!");
	_bar.setMessage( opts.message ? opts.message : "" );
	_bar.setOkBtnLabel( opts.okBtnLabel ? opts.okBtnLabel : "Ok" );
	_bar.onshow = opts.onshow ? opts.onshow : function() {
	};
	_bar.onhide = opts.onhide ? opts.onhide : function() {
	};
	_bar.onshowComplete = opts.onshowComplete ? opts.showComplete : function() {
	}
	_bar.onhideComplete = opts.onhideComplete ? opts.onhideComplete : function() {
	}
	_bar.onok = opts.onok ? opts.onok : null;

	if(_bar.onshow != null) {
		_bar.onshow();	
	}
	$(_bar.div).slideDown( _bar.showDur, function() {
		// call onclose method
		
		if(opts.hideAfterDelay) {
			_bar.hideAfterDelay( opts.hideAfterDelay );
		}

		if(_bar.onshowComplete != null) {
			_bar.onshowComplete();	
		}
	})
}



// ------------------------------------
// SHOW AND HIDE AFTER DELAY
// shows the alert bar and hides after specified time
//
JLSAlertBar.prototype.showAndHideAfterDelay = function( delay ) {
	var _bar = this;
	$(_bar.div).slideDown( _bar.showDur, function() {
		// call onclose method
		_bar.hideAfterDelay( delay );
	})
}


// ------------------------------------
// HIDE
// hides and removes the alert bar
//
JLSAlertBar.prototype.hide = function() {
	var _bar = this;
	if(_bar.onhide != null) {
			_bar.onhide();	
		}
	$(_bar.div).slideUp( _bar.hideDur, function() {
		// call onclose method
		if(_bar.onhideComplete != null) {
			_bar.onhideComplete();	
		}
		// if need to remove after hiding
		if(_bar.removeAfterHiding) {
			// remove bar element
			$(_bar.div).remove();
			// delete the bar
			delete _bar;
		}
	})
}

// ------------------------------------
// HIDE AFTER DURATION
// hides and removes the alert bar after certain amount of time in seconds
//
JLSAlertBar.prototype.hideAfterDelay = function( delay ) {
	var _bar = this;
	setTimeout( function() { _bar.hide(); }, delay * 1000 );
}




// ____________________________________________________________
// ============================================================
// ALERT BOX
//
//
var JLSAlertBox = JLSObject.extend({
	init:function( options ) {
		var _box = this;
		// set options
		this._super( options );
		
		if( elementExists( options )) {
			_box.div = $('#'+options.id);
		} else {
			_box.div = $('<div>')
				.appendTo($(options.parent));	
		}
	
		$(_box.div)
			.addClass('JLSui-alert-box')
			.attr('id', options.id )
			.data( 'owner', _box )
			.click( function(e) {
				e.stopPropagation();
			})
	/*	_box.bg = $('<div>')
			.addClass('bg')
			.appendTo( _box.div )
		*/	
			
		_box.content = $('<div>')
			.addClass('content-holder')	
			.appendTo( _box.div );
			
		_box.header = $( '<p>')
			.addClass( 'header')
			.appendTo( _box.content)
			.html( options.title )
		
		_box.subheader = $('<p>')
			.addClass( 'subheader')
			.appendTo( _box.content)
			.html( options.message )
			
		_box.actionArea = $('<div>')
			.addClass( 'action-area')
			.appendTo( _box.content );
			
		// ok btn
		_box.okBtn = new JLSBtn({
			classes:options.okBtn ? options.okBtn.classes != null ? options.okBtn.classes : "" : "",
			parent:_box.actionArea,
			label:options.okBtn ? options.okBtn.title != null ? options.okBtn.title : "Ok" : "Ok",
			onclick:function() { 
				if(_box.onok) {
					_box.onok();	
				} else {
					_box.hide();
				}
			}
		})
		// ok btn
		_box.cancelBtn = new JLSBtn({
			classes:options.cancelBtn ? options.cancelBtn.classes != null ? options.cancelBtn.classes : "" : "",
			parent:_box.actionArea,
			label:options.cancelBtn ? options.cancelBtn.title != null ? options.cancelBtn.title : "Cancel" : "Cancel",
			onclick:function() { 
				if(_box.oncancel) {
					_box.oncancel();	
				} else {
					_box.hide();
				}
			}
		})
		
		_box.loaderArea = $('<div>')
			.addClass( 'loader-area' )
			.appendTo( _box.content );
			
		var opts = {
		  lines: 9, // The number of lines to draw
		  length: 4, // The length of each line
		  width: 4, // The line thickness
		  radius: 7, // The radius of the inner circle
		  corners: 1, // Corner roundness (0..1)
		  rotate: 0, // The rotation offset
		  direction: 1, // 1: clockwise, -1: counterclockwise
		  color: '#fff', // #rgb or #rrggbb
		  speed: 1.1, // Rounds per second
		  trail: 60, // Afterglow percentage
		  shadow: false, // Whether to render a shadow
		  hwaccel: false, // Whether to use hardware acceleration
		  className: 'spinner', // The CSS class to assign to the spinner
		  zIndex: 2e9, // The z-index (defaults to 2000000000)
		  top: 'auto', // Top position relative to parent in px
		  left: 'auto' // Left position relative to parent in px
		};
	var spinner = new Spinner(opts).spin();
 	
	
		$(_box.loaderArea).append( spinner.el );
		
		
		$(document).scroll(function() {
			if(_box.visible) {
				console.log("resize box");
				_box.resize();
			}
		})
		
			
		/*for(var i = 0; i < options.btns.length; i++) {
				
		}*/
	
		return this;	
	}
})

// regular settings
JLSAlertBox.prototype.removeAfterHiding = false;

// callback methods
JLSAlertBox.prototype.onshow = null;
JLSAlertBox.prototype.onshowComplete = null;
JLSAlertBox.prototype.onhide = null;
JLSAlertBox.prototype.onhideComplete = null;
JLSAlertBox.prototype.onok = null;
JLSAlertBox.prototype.oncancel = null;

// display settings
JLSAlertBox.prototype.showDur = 400;
JLSAlertBox.prototype.hideDur = 400;
JLSAlertBox.prototype.visible = false;


// ------------------------------------
// SET TITLE
// sets the title of the alert bar
//
JLSAlertBox.prototype.setTitle = function( _title ) { 
	var _box = this;
	$(_box.header).html( _title );
}

// ------------------------------------
// SET MESSAGE
// sets the message of the alert bar
//
JLSAlertBox.prototype.setMessage = function( _message ) { 
	var _box = this;
	$(_box.subheader).html( _message );
}
// ------------------------------------
// SET OK BTN LABEL
// sets the label of the ok btn
//
JLSAlertBox.prototype.setOkBtnLabel = function( _label ) { 
	var _box = this;
	_box.okBtn.setLabel( _label );
}
// ------------------------------------
// SET CANCEL BTN LABEL
// sets the label of the ok btn
//
JLSAlertBox.prototype.setCancelBtnLabel = function( _label ) { 
	var _box = this;
	_box.cancelBtn.setLabel( _label );
}
// ------------------------------------
// SHOW / HIDE ACTION AREA
// makes the action area visible
//
JLSAlertBox.prototype.showActionArea = function( animated ) {
	var _box = this;
	if(animated) {
	} else {
		$(_box.actionArea).css({
			'display':'block'
		})
	}
}
JLSAlertBox.prototype.hideActionArea = function( animated ) {
	var _box = this;
	if(animated) {
	} else {
		$(_box.actionArea).css({
			'display':'none'
		})
	}
}
// ------------------------------------
// SHOW / HIDE LOADER AREA
// makes the loader area visible
//
JLSAlertBox.prototype.showLoaderArea = function( animated ) {
	var _box = this;
	if(animated) {
	} else {
		$(_box.loaderArea).css({
			'display':'block'
		})
	}
}
JLSAlertBox.prototype.hideLoaderArea = function( animated ) {
	var _box = this;
	if(animated) {
	} else {
		$(_box.loaderArea).css({
			'display':'none'
		})
	}
}
// ------------------------------------
// SHOW
// shows the alert bar
//
JLSAlertBox.prototype.show = function( opts ) {
	var _box = this;
	
	_box.visible = true;
	
	// show / hide action area
	if(!opts.showActionArea) {
		_box.hideActionArea(false);
	} else {
		_box.showActionArea(false);	
	}
	
	// show hide loader area
	if(!opts.showLoaderArea) {
		_box.hideLoaderArea(false);	
	} else {
		_box.showLoaderArea(false);	
	}
	
	// set text
	_box.setTitle( opts.title ? opts.title : "Whoops!");
	_box.setMessage( opts.message ? opts.message : "" );
	
	// set callbacks
	_box.onshow = opts.onshow ? opts.onshow : function() {
	};
	_box.onhide = opts.onhide ? opts.onhide : function() {
	};
	_box.onshowComplete = opts.onshowComplete ? opts.showComplete : function() {
	}
	_box.onhideComplete = opts.onhideComplete ? opts.onhideComplete : function() {
	}
	
	// ok btn
	_box.onok = opts.onok ? opts.onok : null;
	_box.setOkBtnLabel( opts.okBtnLabel ? opts.okBtnLabel : "Ok" );
	
	// cancel btn
	_box.oncancel = opts.oncancel ? opts.oncancel : null;
	_box.setCancelBtnLabel( opts.cancelBtnLabel ? opts.cancelBtnLabel : "Cancel" );
	$(_box.cancelBtn.div).css({
		display:opts.oncancel ? 'inline-block' : 'none'
	})
	
	$(_box.div).css({
		display:'block'
	})
	
	_box.resize();
	
	if(_box.onshow != null) {
		_box.onshow();	
	}
	TweenLite.to( $(_box.content), _box.showDur / 1000, { css:{ scale:1 }});
	TweenLite.to( $(_box.div), _box.showDur / 1000, { css:{ autoAlpha:1, display:'block' }, onComplete:function() {
		// call onclose method
		
		if(opts.hideAfterDelay) {
			_box.hideAfterDelay( opts.hideAfterDelay );
		}

		if(_box.onshowComplete != null) {
			_box.onshowComplete();	
		}
	}})
}



// ------------------------------------
// SHOW AND HIDE AFTER DELAY
// shows the alert bar and hides after specified time
//
JLSAlertBox.prototype.showAndHideAfterDelay = function( delay ) {
	var _box = this;
	
	TweenLite.to( $(_box.content), _box.showDur / 1000, { css:{ scale:1 }});
	TweenLite.to( $(_box.div), _box.showDur / 1000, { css:{ autoAlpha:1, display:'block' }, onComplete:function() {
		// call onclose method
		_box.hideAfterDelay( delay );
	}})
}


// ------------------------------------
// HIDE
// hides and removes the alert bar
//
JLSAlertBox.prototype.hide = function() {
	var _box = this;
	if(_box.onhide != null) {
			_box.onhide();	
		}
	
	TweenLite.to( $(_box.content), _box.hideDur / 1000, { css:{ scale:.8 }});
	TweenLite.to( $(_box.div), _box.hideDur / 1000, { css:{ autoAlpha:0, display:'none' }, onComplete:function() {
		
		// set visible to false
		_box.visible = false;
		
		// call onclose method
		if(_box.onhideComplete != null) {
			_box.onhideComplete();	
		}
		// if need to remove after hiding
		if(_box.removeAfterHiding) {
			// remove bar element
			$(_box.div).remove();
			// delete the bar
			delete _box;
		}
	}})
}

// ------------------------------------
// HIDE AFTER DURATION
// hides and removes the alert bar after certain amount of time in seconds
//
JLSAlertBox.prototype.hideAfterDelay = function( delay ) {
	var _box = this;
	setTimeout( function() { _box.hide(); }, delay * 1000 );
}


// ------------------------------------
// RESIZE
// 
//
JLSAlertBox.prototype.resize = function() {
	var _box = this;
	
	$( _box.div ).width( $(window).width() );
	$( _box.div ).height( $(window).height() );
	
	$( _box.content ).css({
		left:($(window).width() - $(_box.content).outerWidth(true)) / 2,
		top:($(window).height() - $(_box.content).outerHeight(true)) / 2
	})
}










