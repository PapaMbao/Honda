/**************************************************
Trivantis (http://www.trivantis.com)
**************************************************/

// Menu Object
function ObjMenu(n,a,i,x,y,w,h,v,z,c,hc,bc,bhc,brdc,sepc,sepc2,hz,b3,p,dummy,align,fb,cl) {
  this.name = n
  this.altName = a
  this.x = x
  this.origX = x
  this.bgImg = i
  this.y = y
  this.w = w
  this.h = h
  this.oh = h;
  this.ow = w;
  this.v = v
  this.z = z
  this.txtColor = c
  this.hlColor = hc
  this.bgColor = bc
  this.bgHlColor = bhc
  this.brdClr=brdc
  this.sepClr=sepc
  this.sepClr2=sepc2
  this.bHorz=hz
  this.b3d=b3
  this.parentMenu=p
  this.obj = this.name+"Object"
  this.mnArray = new Array
  this.subMenuArray = new Array
  this.numMenus = 0
  this.hrefPrompt = 'javascript:void(null);'
  this.alreadyActioned = false;
  this.activeChild=0
  this.mouseIn=0
  this.txtAlign=align
  eval(this.obj+"=this")
  this.addClasses = cl;
  this.bBottom = fb?true:false;
  this.opacity = 100;
  this.bFixedPosition = false;
  this.bInherited = false;
  this.compInd = null;
  this.ipInd = null; 
  this.nsInd = null;
  this.firstItem = true;
}

function ObjMenuActionGoTo( destURL, destFrame ) {
  this.objLyr.actionGoTo( destURL, destFrame );
}

function ObjMenuActionGoToNewWindow( destURL, name, props ) {
  this.objLyr.actionGoToNewWindow( destURL, name, props );
}

function ObjMenuActionPlay( ) {
    this.objLyr.actionPlay();
}

function ObjMenuActionStop( ) {
    this.objLyr.actionStop();
}

function ObjMenuActionShow( ) {
  if( !this.isVisible() )
    this.onShow();
}

function ObjMenuActionHide( ) {
  if( this.isVisible() )
    this.onHide();
}

function ObjMenuActionLaunch( ) {
  this.objLyr.actionLaunch();
}

function ObjMenuActionExit( ) {
  this.objLyr.actionExit();
}

function ObjMenuActionChangeContents( value, align, fntId ) {
    this.objLyr.actionChangeContents( value, align, fntId );
}

function ObjMenuActionTogglePlay( ) {
    this.objLyr.actionTogglePlay();
}

function ObjMenuActionToggleShow( ) {
  if(this.objLyr.isVisible() && !this.objLyr.bInTrans) this.actionHide();
  else this.actionShow();
}

{ // Setup prototypes
var p=ObjMenu.prototype
p.build = ObjMenuBuild
p.init = ObjMenuInit
p.activate = ObjMenuActivate
p.up = ObjMenuUp
p.down = ObjMenuDown
p.over = ObjMenuOver
p.out = ObjMenuOut
p.capture = 0
p.onOver = new Function()
p.onOut = new Function()
p.onSelect = new Function()
p.onDown = new Function()
p.onUp = new Function()
p.actionGoTo = ObjMenuActionGoTo
p.actionGoToNewWindow = ObjMenuActionGoToNewWindow
p.actionPlay = ObjMenuActionPlay
p.actionStop = ObjMenuActionStop
p.actionShow = ObjMenuActionShow
p.actionHide = ObjMenuActionHide
p.actionLaunch = ObjMenuActionLaunch
p.actionExit = ObjMenuActionExit
p.actionChangeContents = ObjMenuActionChangeContents
p.actionTogglePlay = ObjMenuActionTogglePlay
p.actionToggleShow = ObjMenuActionToggleShow
p.writeLayer = ObjMenuWriteLayer
p.onShow = ObjMenuOnShow
p.onHide = ObjMenuOnHide
p.menuTimeout = ObjMenuTimeout
p.menuRemove = ObjMenuRemove
p.menuOver = ObjMenuOver
p.menuOut = ObjMenuOut
p.addMenu = ObjMenuAddMenu
p.isVisible = ObjMenuIsVisible
p.sizeTo = ObjMenuSizeTo
p.onMoved = ObjMenuOnMoved
p.onSelChg = new Function()
p.setIndicators = ObjMenuSetIndicators
p.updateIndicators = ObjMenuUpdateIndicators
p.loadProps = ObjLoadProps
p.respChanges = ObjRespChanges
p.refresh = ObjMenuRefresh
p.setupObjLayer = ObjMenuSetupObjLayer
p.getPreloadString = ObjMenuGetPreloadString
p.getCSS = ObjMenuGetCSS
p.rv = ObjMenuRV
p.focus = ObjMenuFocus
p.menuOnKeydown = ObjMenuOnKeydown;
}

function ObjMenuBuild() {
	
	this.loadProps();
	
	this.css = this.getCSS();

	this.bInherited = checkObjectInheritance(this);

	if(this.bInherited)
		return;

	var divStart
	var divEnd
	divStart = '<div id="'+this.name+'"'
	if (this.parentMenu == 0) divStart += 'role="menubar" aria-label="Main Menu" tabindex="-1"' // LD-8439: Add role and aria-label to main menu
	else divStart += 'role="menu" aria-label="submenu" tabindex="-1"' // LD-8439: Add role and aria-label to submenus
	if( this.addClasses ) divStart += ' class="'+this.addClasses+'"'
	if( this.altName ) divStart += ' alt="'+this.altName+'"'
	else { if( this.altName != null ) divStart += ' alt=""' }
	divStart += '><a name="'+this.name+'anc">'
	divEnd   = '</a></div>'
	this.div = divStart + '\n'
	for (var i=0; i < this.numMenus; i++) this.div = this.div + this.mnArray[i]
	this.div = this.div + divEnd + '\n'

	this.div = CreateHTMLElementFromString(this.div);
}

function ObjMenuInit() {
  this.objLyr = new ObjLayer(this.name, null, null, this.div)
  if(!isSinglePagePlayerAvail() && !window.bTrivResponsive) adjustForFixedPositon(this);

	// LD-8611: Attach mouseover event to each menu item
	var menuItems = this.objLyr.ele.querySelectorAll('[role="menuitem"]');
	var self = this; // Reference to the ObjMenu instance
	menuItems.forEach(function (item) {
		item.addEventListener('mouseover', function () {
			var submenu = item.getAttribute('submenu');
			if (submenu) {
				var child = eval(submenu + 'Object');
				self.menuOver(item, child);
			}
			else {
				self.menuOver(item);
			}
		});
	});
}

function ObjMenuActivate() {
	if( this.objLyr && this.objLyr.styObj && !this.alreadyActioned ) {
		if( this.v ) 
			this.actionShow()
		else 
			this.actionHide()
	}
	if(!this.bInherited)
		this.setupObjLayer();
  
	this.objLyr.theObj = this;
}

function ObjMenuDown() {
  if( is.ie && event.button != 1 ) return
  this.onSelect()
  this.onDown()
}

function ObjMenuUp() {
  if (is.ie && event.button!=1) return
  this.onUp()
}

function ObjMenuOver() {
  this.onOver()
}

function ObjMenuOut() {
  this.onOut()
}

function ObjMenuWriteLayer( newContents ) {
  if (this.objLyr) this.objLyr.write( newContents )
}

function ObjMenuOnShow() {
  this.alreadyActioned = true;
  this.objLyr.actionShow();
  if (this.indSz && Number(this.indSz)!=NaN )
	this.updateIndicators();
}

function ObjMenuOnHide() {
  this.alreadyActioned = true;
  this.objLyr.actionHide();
  if( this.parentMenu && this.parentMenu.parentMenu ) this.parentMenu.menuTimeout();
}

function ObjMenuTimeout() {
  if( this.objLyr && this.objLyr.styObj.visibility.indexOf("inherit") != 0 ) return;
  var mouseIn = this.mouseIn;
  if( !mouseIn ) {
    var check = this.parentMenu;
    mouseIn = check.mouseIn;
    while( !mouseIn && check.parentMenu ) {
      check = check.parentMenu;
      mouseIn = check.mouseIn;
    }
  }
  if( !mouseIn && this.activeChild ) {
    var check = this.activeChild;
    mouseIn = check.mouseIn;
    while( !mouseIn && check.activeChild ) {
      check = check.activeChild;
      mouseIn = check.mouseIn;
    }
  }

  if( !mouseIn ) { 
    this.actionHide();
    if( this.parentMenu.activeChild == this ) this.parentMenu.activeChild=0;
    if( this.activeChild ) this.activeChild.menuTimeout();
  }
}

function ObjMenuRemove( item ) {
    this.mouseIn = 0;
    if( this.objLyr.styObj.visibility.indexOf("inherit") != 0 )  return;
	// LD-8733: Added null checks for clarity and safety
    if( item && item.style ) { 
      item.style.color='#' + this.txtColor;
      if(this.bgImg||!this.bgColor) item.style.backgroundColor='transparent';
	  else item.style.backgroundColor='#' + this.bgColor;
      var arrowImage = getDisplayDocument().images[item.id + 'arrow'];
	  if (arrowImage) arrowImage.src = 'images/' + (this.bHorz ? 'triv_menarh' : 'triv_menar') + this.txtColor + '.gif'; // LD-8649: Change arrow image based on menu orientation
    }
	this.actionHide();
	if( this.parentMenu.activeChild == this ) this.parentMenu.activeChild=0;
	if( this.activeChild ) this.activeChild.menuTimeout();
}

function ObjMenuOver( item, child ) {
    this.mouseIn = 1;
	// LD-8733: Added null checks for clarity and safety
	if( item && item.style ) { 
	  if( !this.bgHlColor ) item.style.backgroundColor='transparent';
	  else item.style.backgroundColor='#' + this.bgHlColor;      
      var spanElement = getDisplayDocument().getElementById(item.id+"span");
	  if (spanElement && spanElement.style) spanElement.style.color='#' + this.hlColor;
	  var arrowImage = getDisplayDocument().images[item.id + 'arrow'];
	  if (arrowImage) arrowImage.src = 'images/' + (this.bHorz ? 'triv_menarh' : 'triv_menar') + this.hlColor + '.gif'; // LD-8649: Change arrow image based on menu orientation
	}
	if( child ) {
	  if( this.activeChild ) {
	    if( this.activeChild == child ) return;
		this.activeChild.actionHide();	  
	  }  
	  this.activeChild=child
	  child.actionShow()
	} else if( this.activeChild ) { this.activeChild.actionHide(); this.activeChild=0; }
}

function ObjMenuOut( item, child ) {
    this.mouseIn = 0;
	// LD-8733: Added null checks for clarity and safety
	if( item && item.style ) { 
      if(this.bgImg||!this.bgColor) item.style.backgroundColor='transparent';
      else item.style.backgroundColor='#' + this.bgColor;
	  var spanElement = getDisplayDocument().getElementById(item.id+"span");
	  if (spanElement && spanElement.style) spanElement.style.color='#' + this.txtColor;
	  var arrowImage = getDisplayDocument().images[item.id + 'arrow'];
	  if (arrowImage) arrowImage.src = 'images/' + (this.bHorz ? 'triv_menarh' : 'triv_menar') + this.txtColor + '.gif'; // LD-8649: Change arrow image based on menu orientation
	}
	if( child ) setTimeout( child.obj + '.menuTimeout()', 1000 )
	if( this.parentMenu ) setTimeout( this.obj + '.menuTimeout()', 1000 )
}

function ObjMenuSetIndicators(compInd,ipInd,nsInd,indSz) {
	this.compInd = compInd;
	this.ipInd = ipInd?ipInd:null;
	this.nsInd = nsInd?nsInd:null;
	this.indSz = (compInd&&indSz&&Number(indSz)!=NaN)?indSz:16;
}

function ObjMenuUpdateIndicators() {
  try {
    if( trivPageTracking && this.objLyr.ele.getElementsByTagName )
    {
      var imgElems = this.objLyr.ele.getElementsByTagName("IMG");
	  for ( var idx=0; imgElems && idx<imgElems.length; idx++ )
	  {
		if (imgElems[idx] && imgElems[idx].attributes['itemid'] )
		{
			var pageId = imgElems[idx].attributes['itemid'].value;
			var status = trivPageTracking.GetRangeStatus( pageId );
			if( status == 'notstarted' )
				imgElems[idx].src = this.nsInd;
			else if( status == 'inprogress' )
				imgElems[idx].src = this.ipInd;
			else 
				imgElems[idx].src = this.compInd;

			// LD-8440: Traverse up to find the parent div with role=menuitem and update aria-label
			var parentDiv = imgElems[idx].closest('div[role="menuitem"]');
			if (parentDiv) {
				var imgId = imgElems[idx].id.replace('ind', '');
				var parentDivId = parentDiv.id;

				if (imgId === parentDivId) {
					var itemName = parentDiv.getAttribute('name') || '';
					var newAriaLabel = itemName + ' ';

					if (status == 'notstarted')
						newAriaLabel += trivstrSTATNS;
					else if (status == 'inprogress')
						newAriaLabel += trivstrSTATIP;
					else
						newAriaLabel += trivstrSTATC;

					parentDiv.setAttribute('aria-label', newAriaLabel);
				}
			}
		}
	  }	
    }
  } catch(err) {}
}

function ObjMenuAddMenu(nm,l,t,w,h,lb,tb,rb,bb,c,s,m,itemId) {
  var index = this.name.indexOf( '_' );
  var jsObj = this.name+"Object"
  var fontName = index >= 0?String(this.name.substr( 0, index )+"Font2"):String(this.name+"Font1");
  // LD-8439: aria role and label and other attributes added for accessible menu
  var divstr='<div id="' + nm + '" name="' + s + '"  role="menuitem" submenu="' + c + '" aria-label="' + s + '"'
  if (this.firstItem && this.parentMenu == 0) divstr += 'tabindex = "0"'
  else divstr += 'tabindex = "-1"'
  this.firstItem = false;
  if (c != '') divstr += 'aria-haspopup="true" aria-expanded="false"'
  divstr += 'style="box-sizing:';
  divstr+=  (is.chrome?'content-box;':'border-box;');
  divstr+=  ' cursor:pointer; position:absolute; left:';
  var tableW = w;
  var tableH = h;
  var ptrMarg = m-4;
  if ( ptrMarg<0 )
    ptrMarg=0;
  if( is.ie && !is.ieMac && !is.op ){
    w += (lb + rb);
    h += (tb + bb);
  }
  divstr += l + 'px; top:' + t + 'px; width:' + w + 'px; height:' + h + 'px;';
  
  if( lb ) divstr += ' border-left:' + lb + 'px #' + (this.b3d ? this.sepClr2 : this.brdClr) + ' solid;'; 
  if( tb ) divstr += ' border-top:' + tb + 'px #' + (this.b3d ? this.sepClr2 : this.brdClr) + ' solid;'; 
  if( rb ) divstr += ' border-right:' + rb + 'px #' + (this.b3d ? this.sepClr : this.brdClr) + ' solid;'; 
  if( bb ) divstr += ' border-bottom:' + bb + 'px #' + (this.b3d ? this.sepClr : this.brdClr) + ' solid;'; 
  if( this.bgImg ) divstr += ' background-color: transparent;';
  else if( this.bgColor ) divstr += ' background-color: #' + this.bgColor + ';';
  // LD-8611: attaching inline keydown handler and passing the callback functions to call on the enter key
  var cb1 = null;
  if (this.parentMenu) cb1 = this.name + 'Object.menuRemove(this)';
  var cb2 = (c == '' && s != '') ? 'triv' + nm + 'Click' : null;
  divstr += '" onkeydown=' + jsObj + '.menuOnKeydown(event,this,' + cb1 + ',' + cb2 + ',' + c + ');';
  divstr += ' onmouseout=' + jsObj + '.menuOut(';
  if( s != '' ) divstr += 'this';
  if( c != '' ) divstr +=  ',' + c + 'Object';
  divstr += ');'
  var isInd = (this.indSz && Number(this.indSz)!=NaN );
  var strRemoveMenu = ''
  if( this.parentMenu ) strRemoveMenu = this.name + 'Object.menuRemove(this); '
  if( c == '' && s != '' ) divstr += ' onclick="' + strRemoveMenu + 'triv' + nm + 'Click();"';
  divstr += '>';
  if( s == '' ){
    divstr += '<div style="background:#' + this.sepClr + '; position:absolute; left:' + (this.bHorz ? w/2 - 1 : 3) + 'px; top:' + (this.bHorz ? 3 : h/2 - 1) + 'px; width:' + (this.bHorz ? 1 : w - 8) + 'px; height:' +  (this.bHorz ? h - 8 : 1) + 'px; clip:rect(0px ' + (this.bHorz ? 1 : w - 8) + 'px ' + (this.bHorz ? h - 8 : 1) + 'px 0px);"></div>';
    if( this.b3d ) divstr += '<div style="background:#' + this.sepClr2 + '; position:absolute; left:' + (this.bHorz ? w/2 : 3) + 'px; top:' + (this.bHorz ? 3 : h/2) + 'px; width:' + (this.bHorz ? 1 : w - 8) + 'px; height:' +  (this.bHorz ? h - 8 : 1) + 'px; clip:rect(0px ' + (this.bHorz ? 1 : w - 8) + 'px ' + (this.bHorz ? h - 8 : 1) + 'px 0px);"></div>';
  }
  else if( c != '' ) 
  {
    // add the table and row to all menu items
    divstr += '<table cellpadding=0 cellspacing=0 aria-hidden="true" class="' + fontName + '" border=0 height=' + tableH + 'px width=' + tableW + '><tr align=' + this.txtAlign + '  valign=middle height=' + tableH + 'px>';
    
	// add left padding for vertical menus and first item on left of horizontal menu
	if ( this.txtAlign == 'left' )
		divstr += '<td width=' + parseInt(isInd?(m/2-1):m)+ 'px height=' + tableH + 'px >&nbsp;</td>';
	else
		divstr += '<td width=' + (isInd?m/2:m)+ 'px height=' + tableH + 'px >&nbsp;</td>';
		
	// if indicator menu, add left padding indicator
	if ( isInd )
	{
		// add right padding for vertical menus and last item on right of horizontal menu
		if ( this.txtAlign == 'left' )
			divstr += '<td width=' + parseInt(this.indSz+4) + 'px height=' + tableH + 'px align=left>';
		else
			divstr += '<td width=' + this.indSz + 'px height=' + tableH + 'px align=left>';
		
		divstr += '<div align="right" style="cursor:pointer; width:' + this.indSz + 'px;"><img itemId="' + itemId + '" id="' + nm + 'ind" name="' + nm + 'ind" src="' + this.compInd + '" height="' + this.indSz  + '" width="' + this.indSz  + '"></div>';
		
		divstr += '</td>';
	}
	
    // add the text contents
    divstr += '<td width=* height=' + tableH + 'px><span id="' + nm + 'span" class="' + fontName + '">' + s + '</span></td>';

    // add right padding for vertical menus and last item on right of horizontal menu
    divstr += '<td width=' + m + 'px height=' + tableH + 'px align=left>';

	divstr += '<div align="right" style="cursor:pointer; display: flex; align-items: center; justify-content: flex-end; width:' + ptrMarg + 'px;"><img id="' + nm + 'arrow" name="' + nm + 'arrow" src="images/' + (this.bHorz ? 'triv_menarh' : 'triv_menar') + this.txtColor + '.gif"></div>';
    
    divstr += '</td>';
    
    divstr += '</tr></table>';
      
  }
  else
  {
    // add the table and row to all menu items
    divstr += '<table cellpadding=0 cellspacing=0 aria-hidden="true" class="' + fontName + '" border=0 height=' + tableH + 'px width=' + tableW + '><tr align=' + this.txtAlign + '  valign=middle height=' + tableH + 'px>';
    
    // add left padding for vertical menus and first item on left of horizontal menu
    if ( this.txtAlign == 'left' )
        divstr += '<td width=' + parseInt(isInd?(m/2-1):m)+ 'px height=' + tableH + 'px >&nbsp;</td>';
    else
	divstr += '<td width=' + (isInd?m/2:m)+ 'px height=' + tableH + 'px >&nbsp;</td>';
        
	// if indicator menu, add left padding indicator
	if ( isInd )
	{
		// add right padding for vertical menus and last item on right of horizontal menu
		if ( this.txtAlign == 'left' )
			divstr += '<td width=' + parseInt(this.indSz+4) + 'px height=' + tableH + 'px align=left>';
		else
			divstr += '<td width=' + this.indSz + 'px height=' + tableH + 'px align=left>';

		divstr += '<div align="right" style="cursor:pointer; width:' + this.indSz + 'px;"><img itemId="' + itemId + '" id="' + nm + 'ind" name="' + nm + 'ind" src="' + this.compInd + '" height="' + this.indSz  + '" width="' + this.indSz  + '"></div>';
		
		divstr += '</td>';
	}
		
    // add the text contents
    divstr += '<td width=* height=' + tableH + 'px><span id="' + nm + 'span" class="' + fontName + '">' + s + '</span></td>';

    // add right padding for vertical menus and last item on right of horizontal menu
    divstr += '<td width=' + m + 'px height=' + tableH + 'px>&nbsp;</td>';
    
    divstr += '</tr></table>';
  }
  
  divstr += '</div>\n';
  this.mnArray[this.numMenus++] = divstr;
  if( c != '' ) this.subMenuArray.push(c);
}

 
function ObjMenuIsVisible() {
  if( this.objLyr.isVisible() )
    return true;
  else
    return false;
}

function ObjMenuSizeTo( w, h ) {
  this.w = w
  this.h = h
  this.build()
  if(this.objLyr)
  {
	  this.activate()
	  this.objLyr.clipTo( 0, w, h, 0  )
  }
}

function ObjMenuOnMoved( ) {
  var adjX = this.objLyr.newX - this.x;
  var adjY = this.objLyr.newY - this.y;
  for ( var i=0; i<this.subMenuArray.length; i++ )
  {
	var subMenu = eval(this.subMenuArray[i]);
	if ( subMenu )
	{
		subMenu.objLyr.ele.style.left = subMenu.x+adjX+"px";
		subMenu.objLyr.ele.style.top = subMenu.y+adjY+"px";
		subMenu.objLyr.hasMoved = true; 
		subMenu.objLyr.newX = parseInt(subMenu.objLyr.ele.style.left); 
		subMenu.objLyr.newY = parseInt(subMenu.objLyr.ele.style.top); 
		subMenu.onMoved()		
	}
  }
}

function ObjLoadProps()
{
	if(is.jsonData != null)
	{
		var respValues = is.jsonData[is.clientProp.device];
		var newValues;
		newValues = respValues[is.clientProp.width];
		var obj = newValues[this.name];
		if(obj)
		{
			this.x = typeof(obj.x)!="undefined"?obj.x:this.x;
			this.origX = typeof(obj.x)!="undefined"?obj.x:this.x;
			this.y = typeof(obj.y)!="undefined"?obj.y:this.y;
			this.w = typeof(obj.w)!="undefined"?obj.w:this.w;
			this.h = typeof(obj.h)!="undefined"?obj.h:this.h;
			this.bBottom = (typeof(obj.bOffBottom)!="undefined"?obj.bOffBottom:this.bBottom);
		}
	}
}

function ObjRespChanges()
{
	if(this.objLyr)
	  this.sizeTo(this.w, this.h);
	else
	  this.build();
	
	//Adjust the CSS
	FindAndModifyObjCSSBulk(this);	
}

function ObjMenuRefresh(){
	if(this.bInherited)
	{
		//If it is an inherited object the DIV might not reflect the correct dom element
		if(!this.div.parentElement)
			this.div = getHTMLEleByID(this.name);
		
		this.setupObjLayer();
	}
}

function ObjMenuGetPreloadString()
{
	var strPreloads = "";

	if ( this.bgImg && this.bgImg.length )
		strPreloads = "'" + this.bgImg + "'";
	if ( this.compInd && this.compInd.length )
		strPreloads += ",'" + this.compInd + "'";
	if ( this.ipInd && this.ipInd.length )
		strPreloads += ",'" + this.ipInd + "'";
	if ( this.nsInd && this.nsInd.length )
		strPreloads += ",'" + this.nsInd + "'";
  
  //LD-6749 Cleanup if preload string if menu did not have background image   
  if(strPreloads.indexOf(',')==0)
    strPreloads = strPreloads.substring(1, strPreloads.length);

	return strPreloads;
}

function ObjMenuSetupObjLayer(){
	if( this.capture & 4 ) {
		this.objLyr.ele.onmousedown = new Function(this.obj+".down(); return false;")
		this.objLyr.ele.onmouseup = new Function(this.obj+".up(); return false;")
	}

	if( this.capture & 1 ) 
		this.objLyr.ele.onmouseover = new Function(this.obj+".over(); return false;")
	if( this.capture & 2 ) 
		this.objLyr.ele.onmouseout = new Function(this.obj+".out(); return false;")
}

function ObjMenuGetCSS(){
	var css = '';
	var other = 'align:center; text-align:' + this.txtAlign + '; vertical-align:center; color:#' + this.txtColor + ';';
	var tmpColor = '#' + this.bgColor;

	if( this.bgImg ) 
	{
		other += ' background-image:URL('+this.bgImg+');  repeat:yes;';
		if (tmpColor)
			other += 'background-color:'+tmpColor+';'
		tmpColor = null;
	}
	if ( is.ie && is.v=='7' )
		other += ' clipright:'+(this.w+2)+'px; clipbottom:'+(this.h+2)+'px;';
	if(!this.bgHlColor)
		tmpColor = null;

	css = buildCSS(this.name,this.bFixedPosition,this.x,this.y,this.w,this.h,this.v,this.z, tmpColor,other)
	
	return css;
}

function ObjMenuRV(){
	this.loadProps();
	if(!window.bTrivResponsive)
	{
		this.h = this.oh;
		this.w = this.ow;
	}
	this.css = this.getCSS();
	this.refresh();
	if(this.objLyr && this.objLyr.ele)
	{
		for(var index = 0; index < this.objLyr.ele.style.length;index++)
		{
			var styleName = this.objLyr.ele.style[index];
			this.objLyr.ele.style[styleName]="";
		}
		if(!this.v)
			this.objLyr.ele.style.visibility = 'hidden';
	}
}

function ObjMenuFocus()
{
    var focusElem = this.div;
    setTimeout(function () {
        if (focusElem) focusElem.focus();
    }, focusActionDelay);
}


/* ----------- LD-8611: Menu keyboard navigation code starts here ---------- */

/**
 * Retrieves all the menu item elements from the menu objects.
 * @returns {Array<HTMLElement>} An array of menu item elements.
 */
function getAllMenuItemElements() {
	return arObjs.reduce((focusableElements, menuObj) => {
		if (menuObj.objLyr && menuObj.objLyr.ele) {
			var menuItems = menuObj.objLyr.ele.querySelectorAll('[role="menuitem"]');
			focusableElements.push(...menuItems);
		}
		return focusableElements;
	}, []);
}

/**
 * Retrieves the active parent menubar element based on the provided active element.
 * @param {HTMLElement} activeElement - The active element in the document.
 * @returns {HTMLElement|null} - The active parent menubar element or activeElement if not found.
 */
function getActiveParentMenubar(activeElement) {
	var elements = arObjs.map(obj => obj.objLyr && obj.objLyr.ele);
	var currentElement = activeElement;

	while (currentElement && !elements.includes(currentElement)) {
		currentElement = currentElement.parentElement;
	}

	if (currentElement && currentElement.getAttribute('role') === 'menu') {
		var currentIndex = elements.indexOf(currentElement);
		var previousElement = elements[currentIndex - 1];

		while (previousElement && previousElement.getAttribute('role') === 'menu') {
			currentIndex--;
			previousElement = elements[currentIndex - 1];
		}
		return previousElement;
	}
	return currentElement;
}

/**
 * Returns the index of the active element in the array of objects.
 * @param {HTMLElement} activeElement - The active element.
 * @returns {number} - The index of the active element in the array of objects.
 */
function getActiveElementIndex(activeElement) {
	var elements = arObjs.map(obj => obj.objLyr && obj.objLyr.ele);
	var currentElement = activeElement;

	while (currentElement && !elements.includes(currentElement)) {
		currentElement = currentElement.parentElement;
	}
	return elements.indexOf(currentElement);
}

/**
 * Retrieves the active parent menu element based on the provided active element.
 * @param {HTMLElement} activeElement - The active element.
 * @returns {HTMLElement|null} - The active parent menu element or null if not found.
 */
function getActiveParentMenu(activeElement) {
	var elements = arObjs.map(obj => obj.objLyr && obj.objLyr.ele);
	var currentElement = activeElement;

	while (currentElement && !elements.includes(currentElement)) {
		currentElement = currentElement.parentElement;
	}
	return currentElement;
}

/**
 * Hides all submenus and updates the aria-expanded attribute of menu items.
 */
function hideAllSubMenus() {
	arObjs.forEach(cObj => {
		if (cObj.parentMenu != 0 && cObj.parentMenu !== undefined) {
			cObj.objLyr.styObj.visibility = 'hidden';
		}
	});

	var menuItems = getAllMenuItemElements();
	menuItems.forEach(menuItem => {
		if (menuItem.getAttribute("submenu")) {
			menuItem.setAttribute('aria-expanded', 'false');
		}
	});
}

/**
 * Handles the tab key event.
 * @param {Event} event - The tab key event.
 * @param {HTMLElement} menuitem - The menu item element.
 * @param {ObjMenu} self - The ObjMenu instance.
 */
function handleTab(event, menuitem) {
	if (event.shiftKey) {
		var activeMenuBar = getActiveParentMenubar(menuitem);
		var anchor = activeMenuBar.querySelector('a');
		if (anchor && anchor.firstElementChild) {
			anchor.firstElementChild.setAttribute('tabindex', '-1');
			setTimeout(function () {
				anchor.firstElementChild.setAttribute('tabindex', '0');
			}, 100);
		}
		hideAllSubMenus();
	} else {
		hideAllSubMenus();
	}
}

/**
 * Handles the right arrow key press in the menu.
 * @param {HTMLElement} menuitem - The menu item element.
 * @param {boolean} bHorz - Indicates if the menu is horizontal.
 * @param {HTMLElement} submenu - The submenu element.
 */
function handleArrowRight(menuitem, bHorz, submenu) {
	if (bHorz) {
		focusNextElement(menuitem);
	} else if (menuitem.hasAttribute('aria-expanded') && submenu) {
		focusSubmenu(menuitem, submenu);
	} else {
		var activeMenuBar = getActiveParentMenubar(menuitem);
		var activeMenuBarIndex = getActiveElementIndex(activeMenuBar);
		if (arObjs[activeMenuBarIndex].bHorz) {
			navigateHorizontalMenu(activeMenuBar);
		}
	}
}

/**
 * Handles the left arrow key press in the menu.
 * @param {HTMLElement} menuitem - The menu item element.
 * @param {boolean} bHorz - Indicates if the menu is horizontal.
 */
function handleArrowLeft(menuitem, bHorz) {
	if (bHorz) {
		focusPreviousElement(menuitem);
	} else {
		navigateVerticalMenu(menuitem);
	}
}

/**
 * Handles the Enter or Space key press event for a menu item.
 * @param {HTMLElement} menuitem - The menu item element.
 * @param {HTMLElement} submenu - The submenu element.
 * @param {Function} cb - The callback function to execute.
 */
function handleEnterOrSpace(menuitem, submenu, cb1, cb2) {
	if (menuitem.hasAttribute('aria-expanded') && submenu) {
		focusSubmenu(menuitem, submenu);
	}
	if (cb1 != null) cb1();
	if (cb2 != null) cb2();
}

/**
 * Handles the arrow down key press event for the menu item.
 * @param {HTMLElement} menuitem - The menu item element.
 * @param {boolean} bHorz - Indicates if the menu is horizontal.
 * @param {HTMLElement} submenu - The submenu element.
 */
function handleArrowDown(menuitem, bHorz, submenu) {
	if (!bHorz) {
		focusNextElement(menuitem);
	} else if (menuitem.hasAttribute('aria-expanded') && submenu) {
		focusSubmenu(menuitem, submenu);
	}
}

/**
 * Handles the arrow up key press event for the menu item.
 * @param {HTMLElement} menuitem - The menu item element.
 * @param {boolean} bHorz - Indicates if the menu is horizontal.
 * @param {HTMLElement} submenu - The submenu element.
 */
function handleArrowUp(menuitem, bHorz, submenu) {
	if (!bHorz) {
		focusPreviousElement(menuitem);
	} else if (menuitem.hasAttribute('aria-expanded') && submenu) {
		focusSubmenu(menuitem, submenu, 1);
	}
}

/**
 * Handles the escape key press event for a menu item.
 * @param {HTMLElement} menuitem - The menu item element.
 */
function handleEscape(menuitem) {
	var activeElementIndex = getActiveElementIndex(menuitem);
	var aObj = arObjs[activeElementIndex];
	var subMenuName = aObj.name;
	var menuItemElements = getAllMenuItemElements();
	for (var i = 0; i < menuItemElements.length; i++) {
		var menuItem = menuItemElements[i];
		var submenuAttr = menuItem.getAttribute("submenu");
		if (submenuAttr === subMenuName) {
			if (aObj.parentMenu != 0) {
				aObj.objLyr.styObj.visibility = 'hidden';
			}
			menuItem.focus();
			menuItem.setAttribute('aria-expanded', 'false');
			break;
		}
	}
}

/**
 * Focuses on the next element after the given element.
 * @param {HTMLElement} element - The element to focus on.
 */
function focusNextElement(element) {
	if (element.nextElementSibling) {
		element.nextElementSibling.focus();
	} else {
		var firstSibling = element.parentElement.firstElementChild;
		if (firstSibling) {
			firstSibling.focus();
		}
	}
}

/**
 * Focuses on the previous element relative to the given element.
 * If there is a previous sibling, it will be focused.
 * Otherwise, the last sibling of the parent element will be focused.
 * @param {HTMLElement} element - The element to focus on.
 */
function focusPreviousElement(element) {
	if (element.previousElementSibling) {
		element.previousElementSibling.focus();
	} else {
		var lastSibling = element.parentElement.lastElementChild;
		if (lastSibling) {
			lastSibling.focus();
		}
	}
}

/**
 * Focuses the submenu and expands it.
 * @param {HTMLElement} menuitem - The menu item element.
 * @param {ObjMenu} submenu - The submenu object.
 * @param {boolean} arrowup - Indicates if the arrow key pressed was the up arrow.
 */
function focusSubmenu(menuitem, submenu, arrowup) {
	//var isExpanded = menuitem.getAttribute('aria-expanded') === 'true';
	menuitem.setAttribute('aria-expanded', 'true');
	submenu.objLyr.styObj.visibility = 'visible';
	submenu.updateIndicators();
	//if (!isExpanded) {
	var anchor = submenu.objLyr.ele.querySelector('a');
	if (anchor && anchor.lastElementChild && arrowup) {
		anchor.lastElementChild.focus();
	}
	else if (anchor && anchor.firstElementChild) {
		anchor.firstElementChild.focus();
	}
	//}
}

/**
 * Navigates the horizontal menu by hiding all submenus and focusing on the next element.
 * @param {HTMLElement} activeMenuBar - The active menu bar element.
 */
function navigateHorizontalMenu(activeMenuBar) {
	var children = activeMenuBar.getElementsByTagName("a")[0].children;
	for (var j = 0; j < children.length; j++) {
		var child = children[j];
		if (child.getAttribute("aria-expanded") === "true") {
			hideAllSubMenus();
			focusNextElement(child);
			break;
		}
	}
}

/**
 * Navigates the vertical menu based on the selected menu item.
 * 
 * @param {HTMLElement} menuitem - The selected menu item.
 */
function navigateVerticalMenu(menuitem) {
	var activeElementIndex = getActiveElementIndex(menuitem);
	var aObj = arObjs[activeElementIndex];
	var subMenuName = aObj.name;
	var menuItemElements = getAllMenuItemElements();
	for (var i = 0; i < menuItemElements.length; i++) {
		var menuItem = menuItemElements[i];
		var submenuAttr = menuItem.getAttribute("submenu");
		var activeParent = getActiveParentMenu(menuItem);
		if (submenuAttr === subMenuName) {
			var activeParentIndex = getActiveElementIndex(activeParent);
			if (activeParent.getAttribute("role") == 'menu' ||
				(activeParent.getAttribute("role") == 'menubar' && !arObjs[activeParentIndex].bHorz)) {
				menuItem.focus();
			} else {
				focusPreviousElement(menuItem);
			}
			if (aObj.parentMenu != 0) {
				aObj.objLyr.styObj.visibility = 'hidden';
			}
			menuItem.setAttribute('aria-expanded', 'false');
			break;
		}
	}
}
function ObjMenuOnKeydown(event, menuitem, cb1, cb2, submenu) {

	var key = event.key,
		flag = false;
	var self = this;

	try {
		switch (key) {
			case 'Tab':
				handleTab(event, menuitem);
				break;

			case 'ArrowRight':
				handleArrowRight(menuitem, self.bHorz, submenu);
				flag = true;
				break;

			case 'ArrowLeft':
				handleArrowLeft(menuitem, self.bHorz);
				flag = true;
				break;

			case 'Enter':
			case ' ':
				handleEnterOrSpace(menuitem, submenu, cb1, cb2);
				flag = true;
				break;

			case 'ArrowDown':
				handleArrowDown(menuitem, self.bHorz, submenu);
				flag = true;
				break;

			case 'ArrowUp':
				handleArrowUp(menuitem, self.bHorz, submenu);
				flag = true;
				break;

			case 'Escape':
				handleEscape(menuitem);
				flag = true;
				break;
		}
	}
	catch (error) {
        console.error('Error handling keydown event:', error);
	}

	if (flag) {
		event.stopPropagation();
		event.preventDefault();
	}
}

/* ----------- LD-8611: Menu keyboard navigation code ends here ---------- */