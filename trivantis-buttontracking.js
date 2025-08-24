function ButtonTrackingObj(exp, titleName, cm, frame){
   this.VarTrivBtnTracking = new Variable( 'VarTrivBtnTracking', null, 0, cm, frame, exp, titleName, true );
   this.title = null;
}

ButtonTrackingObj.codeToStateMap =
{
	'N' : 'normalState',
	'O' : 'overState',
	'D' : 'downState',
	'A' : 'disabledState',
	'V' : 'visitedState',
	'S' : 'selectedState'
};
ButtonTrackingObj.stateToCodeMap = {};
for (var key in ButtonTrackingObj.codeToStateMap)
	ButtonTrackingObj.stateToCodeMap[ButtonTrackingObj.codeToStateMap[key]] = key;

ButtonTrackingObj.prototype.InitPageTracking = function ( )
{
	var THIS = this;
	var pageTrackData = this.VarTrivBtnTracking.getValue();
	var bDoInit = true;
	try {
	    if (pageTrackData && pageTrackData.length > 0 && pageTrackData != '~~~null~~~')
	    {
	        var topLevelSplit = pageTrackData.split('#');
	        if (topLevelSplit && topLevelSplit.length > 1)
            {
		        var arrIds = topLevelSplit[0].split(',');
		        var arrStatus = topLevelSplit[1].split(',');
		        for( var i=0; i<arrIds.length; i++ )
		        {
			        var id = parseInt( '0x' + arrIds[i] );
			        var status = arrStatus[i];
			        var node = this.FindNode( this.title, id );
			        if( node )
						node.v = ButtonTrackingObj.codeToStateMap[status] || status;
		        }
    		}
        }
    } catch (e) { }
}

ButtonTrackingObj.prototype.FindNode = function( node, id )
{
	if( node.id == id )
		return node;
	
	var match = null;
	if( typeof( node.c ) != 'undefined' ){
		for( var i=0; i<node.c.length; i++ ){
			match = this.FindNode( node.c[i], id );
			if( match != null )
				break;
		}
	}
	
	return match;
}

ButtonTrackingObj.prototype.InternalGetRangeStatus = function( node )
{
	if( node == null )
		return -1;
		
	if( typeof(node.c) == 'undefined' )
	{
		return node.v;
	}
	else
	{
		return 'normalState';
	}
}


ButtonTrackingObj.prototype.GetRangeStatus = function( id, bInit )
{
	var status = -1;
	if ( bInit ) 
		this.InitPageTracking();
	
	status = this.InternalGetRangeStatus( this.FindNode( this.title, id ) );

	return status;
}


ButtonTrackingObj.prototype.InternalSetRangeStatus=function( node, status )
{
	if( node == null )
		return;
	node.v = status;
	if( status == 0 && typeof(node.c)!='undefined')
	{
		for( var i=0; i<node.c.length; i++ )
			this.InternalSetRangeStatus( node.c[i], status ); 
	}
}

ButtonTrackingObj.prototype.SetRangeStatus = function( id, status /*0 or 1 or 2*/)
{
	this.InternalSetRangeStatus( this.FindNode(this.title, id), status );
	
	this.SavePageTracking();
}

ButtonTrackingObj.prototype.IterateTree = function( func )
{
	var stack = [];
	stack.push( this.title );
	var i = 0;
	while( stack.length > 0 )
	{
		var node = stack.shift();
		
		if( typeof(node.c) != 'undefined' )
			stack = node.c.concat(stack);
			
		//do the thing
		func( node, i, stack );
		i++;
	}	
}

ButtonTrackingObj.prototype.SavePageTracking = function()
{
	var fnIsSaveState = window.ObjButton && ObjButton.isSaveState || function () { return false; };
	var hexString = '';
	var arrayIds = [];
	var arrayStatus= [];
	
	this.IterateTree(function(node, i, stack){
		if (fnIsSaveState(node.v))
		{
			arrayIds.push(node.id);
			arrayStatus.push(node.v);
		}
	});
	
	for( var i=0; i<arrayIds.length; i++ )
		hexString += (i > 0 ? ',' : '') + arrayIds[i].toString(16);

	hexString += (arrayIds.length > 0 ? '#' : '');
	
	for (var i = 0; i < arrayStatus.length; i++)
		hexString += (i > 0 ? ',' : '') + (ButtonTrackingObj.stateToCodeMap[arrayStatus[i]] || arrayStatus[i]);

	//LD-8267 - Added a condition to avoid tracking null/empty data unnecessarily
	if (hexString.length > 0 || (myTop.suspendDataCache && myTop.suspendDataCache.indexOf('VarTrivBtnTracking') >= 0) || !this.VarTrivBtnTracking.bSCORM)
		this.VarTrivBtnTracking.set(hexString);
}

var trivBtnTracking = new ButtonTrackingObj(365,'crf1100l_africa_twin_20ym_technical', 0, null);
trivBtnTracking.title={id:1,v:0,c:[{id:58026,v:'normalState'},{id:52581,v:'normalState'},{id:54047,v:'normalState'},{id:55298,v:'normalState'},{id:56305,v:'normalState'},{id:57312,v:'normalState'},{id:58241,v:'normalState'},{id:87122,v:'normalState'},{id:60360,v:'normalState'},{id:60366,v:'normalState'},{id:60372,v:'normalState'},{id:1463780,v:'normalState'},{id:60378,v:'normalState'},{id:60384,v:'normalState'},{id:1416314,v:'normalState'},{id:1455273,v:'normalState'},{id:69333,v:'normalState'},{id:69339,v:'normalState'},{id:1304853,v:'normalState'},{id:1305500,v:'normalState'},{id:1305494,v:'normalState'},{id:67496,v:'normalState'},{id:1308540,v:'normalState'},{id:1308534,v:'normalState'},{id:1308528,v:'normalState'},{id:1308522,v:'normalState'},{id:1308516,v:'normalState'},{id:69698,v:'normalState'},{id:1309381,v:'normalState'},{id:1309375,v:'normalState'},{id:1309369,v:'normalState'},{id:70123,v:'normalState'},{id:1310161,v:'normalState'},{id:1310155,v:'normalState'},{id:1310149,v:'normalState'},{id:1310143,v:'normalState'},{id:1310137,v:'normalState'},{id:87945,v:'normalState'},{id:27326,v:'normalState'},{id:32171,v:'normalState'},{id:33004,v:'normalState'},{id:544876,v:'normalState'},{id:544828,v:'normalState'},{id:544810,v:'normalState'},{id:544792,v:'normalState'},{id:544774,v:'normalState'},{id:544756,v:'normalState'},{id:544737,v:'normalState'},{id:544720,v:'normalState'},{id:544703,v:'normalState'},{id:544686,v:'normalState'},{id:544669,v:'normalState'},{id:971313,v:'normalState'},{id:971323,v:'normalState'},{id:971333,v:'normalState'},{id:971343,v:'normalState'},{id:544653,v:'normalState'},{id:544642,v:'normalState'},{id:544631,v:'normalState'},{id:544620,v:'normalState'},{id:544609,v:'normalState'},{id:1348741,v:'normalState'},{id:1348732,v:'normalState'},{id:1439459,v:'normalState'},{id:1439490,v:'normalState'},{id:1439498,v:'normalState'},{id:1439558,v:'normalState'},{id:1439589,v:'normalState'},{id:1439597,v:'normalState'},{id:1352612,v:'normalState'},{id:305678,v:'normalState'},{id:1467287,v:'normalState'},{id:1467233,v:'normalState'},{id:1467215,v:'normalState'},{id:1467197,v:'normalState'},{id:1467179,v:'normalState'},{id:1467161,v:'normalState'},{id:1467142,v:'normalState'},{id:1467125,v:'normalState'},{id:1467108,v:'normalState'},{id:1467091,v:'normalState'},{id:1467074,v:'normalState'},{id:1467028,v:'normalState'},{id:1467038,v:'normalState'},{id:1467048,v:'normalState'},{id:1467058,v:'normalState'},{id:1467009,v:'normalState'},{id:1466998,v:'normalState'},{id:1466987,v:'normalState'},{id:1466976,v:'normalState'},{id:1466965,v:'normalState'},{id:1417637,v:'normalState'},{id:1417599,v:'normalState'},{id:1417607,v:'normalState'},{id:1362000,v:'normalState'},{id:184968,v:'normalState'},{id:1362272,v:'normalState'},{id:1362266,v:'normalState'},{id:1362260,v:'normalState'},{id:1362254,v:'normalState'},{id:1362246,v:'normalState'},{id:1362240,v:'normalState'},{id:1362234,v:'normalState'},{id:1362400,v:'normalState'},{id:1362406,v:'normalState'},{id:1362412,v:'normalState'},{id:1362506,v:'normalState'},{id:1362512,v:'normalState'},{id:1362518,v:'normalState'},{id:1362613,v:'normalState'},{id:1362619,v:'normalState'},{id:1362625,v:'normalState'},{id:1362174,v:'normalState'},{id:1362181,v:'normalState'},{id:1362188,v:'normalState'},{id:491288,v:'normalState'},{id:518661,v:'normalState'},{id:305730,v:'normalState'},{id:1466933,v:'normalState'},{id:1466879,v:'normalState'},{id:1466861,v:'normalState'},{id:1466843,v:'normalState'},{id:1466825,v:'normalState'},{id:1466807,v:'normalState'},{id:1466788,v:'normalState'},{id:1466771,v:'normalState'},{id:1466754,v:'normalState'},{id:1466737,v:'normalState'},{id:1466720,v:'normalState'},{id:1466674,v:'normalState'},{id:1466684,v:'normalState'},{id:1466694,v:'normalState'},{id:1466704,v:'normalState'},{id:1466655,v:'normalState'},{id:1466644,v:'normalState'},{id:1466633,v:'normalState'},{id:1466622,v:'normalState'},{id:1466611,v:'normalState'},{id:1422641,v:'normalState'},{id:1422650,v:'normalState'},{id:1449307,v:'normalState'},{id:495245,v:'normalState'},{id:1400178,v:'normalState'},{id:1400172,v:'normalState'},{id:1400166,v:'normalState'},{id:1400160,v:'normalState'},{id:1400154,v:'normalState'},{id:1400146,v:'normalState'},{id:1400140,v:'normalState'},{id:1400134,v:'normalState'},{id:1400283,v:'normalState'},{id:1400289,v:'normalState'},{id:1400295,v:'normalState'},{id:1400390,v:'normalState'},{id:1400396,v:'normalState'},{id:1400402,v:'normalState'},{id:1400496,v:'normalState'},{id:1400502,v:'normalState'},{id:1400508,v:'normalState'},{id:1400751,v:'normalState'},{id:1400757,v:'normalState'},{id:1400763,v:'normalState'},{id:1400065,v:'normalState'},{id:1400072,v:'normalState'},{id:1400079,v:'normalState'},{id:586140,v:'normalState'},{id:586207,v:'normalState'},{id:305787,v:'normalState'},{id:1466565,v:'normalState'},{id:1466511,v:'normalState'},{id:1466493,v:'normalState'},{id:1466475,v:'normalState'},{id:1466457,v:'normalState'},{id:1466439,v:'normalState'},{id:1466420,v:'normalState'},{id:1466403,v:'normalState'},{id:1466386,v:'normalState'},{id:1466369,v:'normalState'},{id:1466352,v:'normalState'},{id:1466306,v:'normalState'},{id:1466316,v:'normalState'},{id:1466326,v:'normalState'},{id:1466336,v:'normalState'},{id:1466287,v:'normalState'},{id:1466276,v:'normalState'},{id:1466265,v:'normalState'},{id:1466254,v:'normalState'},{id:1466243,v:'normalState'},{id:1382463,v:'normalState'},{id:1382429,v:'normalState'},{id:1382437,v:'normalState'},{id:1390892,v:'normalState'},{id:1393984,v:'normalState'},{id:1393992,v:'normalState'},{id:1435921,v:'normalState'},{id:495445,v:'normalState'},{id:1401534,v:'normalState'},{id:1401528,v:'normalState'},{id:1401522,v:'normalState'},{id:1401516,v:'normalState'},{id:1401508,v:'normalState'},{id:1401502,v:'normalState'},{id:1401496,v:'normalState'},{id:1401595,v:'normalState'},{id:1401601,v:'normalState'},{id:1401607,v:'normalState'},{id:1401678,v:'normalState'},{id:1401684,v:'normalState'},{id:1401690,v:'normalState'},{id:1401779,v:'normalState'},{id:1401785,v:'normalState'},{id:1401791,v:'normalState'},{id:1401436,v:'normalState'},{id:1401443,v:'normalState'},{id:1401450,v:'normalState'},{id:494398,v:'normalState'},{id:522749,v:'normalState'},{id:305845,v:'normalState'},{id:1466197,v:'normalState'},{id:1466143,v:'normalState'},{id:1466125,v:'normalState'},{id:1466107,v:'normalState'},{id:1466089,v:'normalState'},{id:1466071,v:'normalState'},{id:1466052,v:'normalState'},{id:1466035,v:'normalState'},{id:1466018,v:'normalState'},{id:1466001,v:'normalState'},{id:1465984,v:'normalState'},{id:1465938,v:'normalState'},{id:1465948,v:'normalState'},{id:1465958,v:'normalState'},{id:1465968,v:'normalState'},{id:1465919,v:'normalState'},{id:1465908,v:'normalState'},{id:1465897,v:'normalState'},{id:1465886,v:'normalState'},{id:1465875,v:'normalState'},{id:1404323,v:'normalState'},{id:1428675,v:'normalState'},{id:1428684,v:'normalState'},{id:1428565,v:'normalState'},{id:1428574,v:'normalState'},{id:1449444,v:'normalState'},{id:495534,v:'normalState'},{id:1408235,v:'normalState'},{id:1408229,v:'normalState'},{id:1408223,v:'normalState'},{id:1408209,v:'normalState'},{id:1408203,v:'normalState'},{id:1408197,v:'normalState'},{id:1411035,v:'normalState'},{id:1411041,v:'normalState'},{id:1411047,v:'normalState'},{id:1411136,v:'normalState'},{id:1411142,v:'normalState'},{id:1411148,v:'normalState'},{id:1408137,v:'normalState'},{id:1408144,v:'normalState'},{id:1408151,v:'normalState'},{id:492955,v:'normalState'},{id:520510,v:'normalState'},{id:305959,v:'normalState'},{id:406157,v:'normalState'}]};
