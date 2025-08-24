function PageTrackingObj(exp, titleName, cm, frame){
   this.VarTrivPageTracking = new Variable( 'VarTrivPageTracking', null, 0, cm, frame, exp, titleName, true );
   this.numPages = 0;
   this.publishTimeStamp = 0;
   this.title = null;
}

PageTrackingObj.prototype.InitPageTracking = function ( )
{
	var THIS = this;
	var pageTrackData = this.VarTrivPageTracking.getValue();
	var bDoInit = true;
	try {
	    if (pageTrackData && pageTrackData.length > 0 && pageTrackData != '~~~null~~~')
	    {
	        var topLevelSplit = pageTrackData.split('#');
	        if (topLevelSplit && topLevelSplit.length > 1)
            {
		        var arrIds = topLevelSplit[0].split(',');
		        var arrStatus = topLevelSplit[1].split('');
		        var bits = 4;
		        for( var i=0; i<arrIds.length; i++ )
		        {
			        var id = parseInt( '0x' + arrIds[i] );
			        var mask = 1<<(i%bits);
			        var status = ( parseInt('0x'+arrStatus[Math.floor(i/bits)] ) & mask ) == 0 ? 1 : 2;
			        var node = this.FindNode( this.title, id );
			        if( node )
				        node.v = status;
		        }
    		}
        }
    } catch (e) { }
}

PageTrackingObj.prototype.FindNode = function( node, id )
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

PageTrackingObj.prototype.InternalGetRangeStatus = function( node )
{
	if( node == null )
		return -1;
		
	if( typeof(node.c) == 'undefined' )
	{
		return node.v;
	}
	else
	{
		// we need to calculate
		if( node.v == 0 )
		{
			var bAllComplete = true;
			var bInprogress = false;
			for( var i=0; i<node.c.length; i++ )
			{
				var cnode = node.c[i];
				var status = this.InternalGetRangeStatus( cnode );
				if( status == 1 || status == 2 )
					bInprogress = true;
				if( status == 0 || status == 1)
					bAllComplete = false;
			}
			
			if( !node.t && bAllComplete )
				return 2;
			else if( bInprogress )
				return 1;
			else
				return 0;
		}
		else
			return node.v
			
	}
}

//returns a incomplete or inprogress or complete
PageTrackingObj.prototype.GetRangeStatus = function( id, bInit )
{
	var status = -1;
	if ( bInit ) 
		this.InitPageTracking();
	
	status = this.InternalGetRangeStatus( this.FindNode( this.title, id ) );
		
	if( status == 0)
		return 'notstarted';	
	else if( status == 1 )
		return 'inprogress';
		
	return 'complete';
}


PageTrackingObj.prototype.InternalSetRangeStatus=function( node, status )
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

PageTrackingObj.prototype.SetRangeStatus = function( id, status /*0 or 1 or 2*/)
{
	this.InternalSetRangeStatus( this.FindNode(this.title, id), status );
	
	this.SavePageTracking();
}

PageTrackingObj.prototype.IterateTree = function( func )
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

PageTrackingObj.prototype.SavePageTracking = function()
{
	var hexVal = 0;
	var hexString = '';
	
	var arrayIds = [];
	var arrayStatus= [];
	
	this.IterateTree( function(node, i, stack){
		if( node.v != 0 )
		{
			arrayIds.push(node.id);
			arrayStatus.push(node.v);
		}
	});
	
	for( var i=0; i<arrayIds.length; i++ )
	{
		if( i!=0 ) hexString += ',';
		hexString += arrayIds[i].toString(16);
	}
	
	hexString += '#';
	
	var bits = 4;
	var num = 0;
	for( var i=0; i<arrayStatus.length; i++ )
	{
		var bit = arrayStatus[i] == 2 ? 1 : 0
		num |= bit << (i%bits);
		if( ((i+1)%bits==0) || ((i+1)==arrayStatus.length) )
		{
			hexString += num.toString(16);
			num = 0;
		}
	}
	
	this.VarTrivPageTracking.set(hexString);
}

PageTrackingObj.prototype.GetNumCompPages = function(childArray, countCompleted)
{
	//Pass in title.c to get all completed pages
	for(var idx = 0; idx < childArray.length; idx++ )
	{
		if(childArray[idx].c)
			countCompleted = this.GetNumCompPages(childArray[idx].c, countCompleted);
		else if( typeof(childArray[idx].c) == 'undefined')
		{
			var strStatus ='';
			strStatus = this.GetRangeStatus(childArray[idx].id);
			if (strStatus === 'complete')
				countCompleted++;
		}
	}
	return countCompleted;
}

var trivPageTracking = new PageTrackingObj(365,'crf1100l_africa_twin_20ym_technical', 0, null);
trivPageTracking.numPages = 84;

trivPageTracking.publishTimeStamp = 2025822121114;

trivPageTracking.title={id:1,v:0,c:[{id:51870,v:0,c:[{id:3620,v:0,c:[{id:3621,v:0},{id:404337,v:0},{id:218515,v:0},{id:17293,v:0},{id:1348521,v:0},{id:1463597,v:0},{id:1312031,v:0},{id:1312083,v:0},{id:1439439,v:0},{id:1439537,v:0},{id:1349258,v:0}]},{id:3622,v:0,c:[{id:221693,v:0},{id:1312933,v:0},{id:1418547,v:0},{id:1418590,v:0},{id:1358467,v:0},{id:1312941,v:0},{id:1312945,v:0},{id:184139,v:0}]},{id:490740,v:0,t:1,c:[{id:1362201,v:0},{id:1362200,v:0},{id:1362199,v:0},{id:1362136,v:0}]},{id:491282,v:0,c:[{id:491290,v:0}]},{id:3624,v:0,c:[{id:221784,v:0},{id:1422595,v:0},{id:1313142,v:0},{id:1370874,v:0},{id:1371361,v:0},{id:1429124,v:0},{id:1429248,v:0},{id:1373501,v:0},{id:1313134,v:0},{id:1342599,v:0},{id:1426260,v:0},{id:1426256,v:0},{id:495223,v:0}]},{id:586210,v:0,t:1,c:[{id:1400093,v:0},{id:1400092,v:0},{id:1400091,v:0},{id:1400090,v:0},{id:1400025,v:0}]},{id:586134,v:0,c:[{id:586142,v:0}]},{id:42358,v:0,c:[{id:221890,v:0},{id:1313286,v:0},{id:1313282,v:0},{id:1384854,v:0},{id:1384875,v:0},{id:1384896,v:0},{id:1384917,v:0},{id:1384938,v:0},{id:1384959,v:0},{id:1313278,v:0},{id:1391061,v:0},{id:1391588,v:0},{id:1393960,v:0},{id:1434319,v:0},{id:1433430,v:0},{id:1436053,v:0},{id:1435915,v:0},{id:495423,v:0}]},{id:493963,v:0,t:1,c:[{id:1401463,v:0},{id:1401462,v:0},{id:1401461,v:0},{id:1401398,v:0}]},{id:494392,v:0,c:[{id:494400,v:0}]},{id:42360,v:0,c:[{id:221897,v:0},{id:1428973,v:0},{id:1313464,v:0},{id:1438698,v:0},{id:1313456,v:0},{id:1404507,v:0},{id:1428629,v:0},{id:1428533,v:0},{id:1428784,v:0},{id:1428800,v:0},{id:495512,v:0}]},{id:492294,v:0,t:1,c:[{id:1408164,v:0},{id:1408163,v:0},{id:1408099,v:0}]},{id:492949,v:0,c:[{id:492957,v:0}]},{id:248704,v:0,c:[{id:653014,v:0},{id:249144,v:0}]},{id:405901,v:0}]}]};
