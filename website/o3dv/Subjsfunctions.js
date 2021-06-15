//var webServiceUrlName = "http://yourwebsite.com/" + "yourwebservice.asmx";


var useRandomColors1 = false;
var useRandomColors2 = false;


var nExtrudeSeries = 8;	
var asGroupExtrudeSeries = false;
var scaleString = "0.85";
var lengthString = "1800";
var tiltStringX = "";
var tiltStringY = "";
var tiltStringZ = "";
var bendString = "";
var bendHorizontal = false;
var bendVertical = false;
var twistString = "";
var shiftXString = "";
var shiftYString = "";
var shiftZString = "";



var keySlideAmount = 40.0;
var keyRotateAmount = 0.015;

var vertexClosenessLimit = 20;


var rightBorder = 30;

var fastVertexNormalMethod = true;


var subdivSurfaceLoopCounter = 0;
var solidToSubdivide;
var subdivTimerId;
var newSubdivFacets = [];
var isSubdividing = false;

var nTextures = 8;
var cubeTexture;
var textureCoordAttribute;
var vertexNormalAttribute;

var findAdjacentLoopCounter = 0;
var facetListToFindAdjacents;
var findAdjacentTimerId;


var colorPickMode = "";
var colorPickWidth = 360 + 100;
var colorPickHeight = 200;
var colorPickHue = 0;
var colorPickLuminosity = 0.5;
var colorPickSaturation = 1.0;

var canvasBackgroundColor = new Color(163, 166, 177);


var defaultDocSize = 10000;
var docSize = defaultDocSize;

var modelSource = "";

var filename = "";
var webServiceResultTag = "Result";

var tumble = true;

var shiftIsDown = false;

var allFacets = [];
var allSortedPoints = [];

var cubes = [];
var previousCubeLists = [];


var gridInterval = 400;
var gridUnits = 100;
var gridIsZY = false;
var gridIsXZ = false;

var lineDiv = -1;
var lineDiv2 = -1;
var lineDiv3D = -1;
var lineDiv23D = -1;

var zoomIncrement = 2500;

function setEditViewOptions()
{
	isOutline = outlinesChosen();
	isShade = solidChosen();
	isGrid = gridChosen();
	isNormals = normalsChosen();
	isClear = document.getElementById("checkboxtransparent").checked;
	isDualSided = document.getElementById("checkboxtwosided").checked;
}

function toolClicked()
{
	isGL = document.getElementById("checkboxwebgl").checked;
	is2dWindow = document.getElementById("checkbox2DWindow").checked;
	
	isTransparent = document.getElementById("checkboxtransparent").checked;

	setShaderFlags();
	
	isTexture = document.getElementById("checkboxtexture").checked;
	
	isSpecular = document.getElementById("checkboxspecular").checked;
	
	alertUser("");
	
	resize();

	setEditViewOptions();
	
	draw();
}

function glClicked()
{
	isGL = document.getElementById("checkboxwebgl").checked;
	is2dWindow = document.getElementById("checkbox2DWindow").checked;
	
	isTransparent = document.getElementById("checkboxtransparent").checked;
	
	setShaderFlags();
	
	isTexture = document.getElementById("checkboxtexture").checked;
	isSpecular = document.getElementById("checkboxspecular").checked;
	
	alertUser("");

	rebuildGL()	

	resize();
	
	draw();
}

function drawClicked()
{
	alertUser("");
	if (toolChosen() == "draw")
	{
		document.getElementById("checkboxgrid").checked = true;
		draw();
	}
}

function zoomIn()
{
	alertUser("");
	if (docSize > zoomIncrement)
	{
		docSize -= zoomIncrement;
		zoomAmountGL -= zoomIncrementGL;
		draw();
	}
}

function zoomOut()
{
	alertUser("");
	if (docSize < 60000)
	{
		docSize += zoomIncrement;
		zoomAmountGL += zoomIncrementGL;
		draw();
	}
}

function zoomNormal(unrotate)
{
	alertUser("");
	{
		var rect = canvas.getBoundingClientRect();
		origin = new Point(-(rect.width / 2), -(rect.height / 2));
	
		if (unrotate == true)
		{
			degreesX = 0;
			degreesY = 0;
			degreesZ = 0;
			radiansX = radians_from_degrees(degreesX);
			radiansY = radians_from_degrees(degreesY);
			radiansZ = radians_from_degrees(degreesZ);
		}
	
		docSize = defaultDocSize;
		zoomAmountGL = 6;
		draw();
	}
}

function showSource()
{
	alertUser("");
	var x = window.open();
	x.document.open();
	
	var src = getSource();	
	x.document.write(src);

	x.document.close();
}

function showKeys()
{
	alertUser("");
	var x = window.open();
	x.document.open();
	
	var src = getKeys();	
	x.document.write(src);

	x.document.close();
}

function showHelp()
{
	alertUser("");
	var x = window.open();
	x.document.open();
	
	var src = getHelp();	
	x.document.write(src);

	x.document.close();
}

function node(name, text)
{
	return "{" + name + "}" + text + "{" + "/" + name + "}";
}

function getSource()
{
	var content = "";

	content += node("r", Math.round(canvasBackgroundColor.R));
	content += node("g", Math.round(canvasBackgroundColor.G));
	content += node("b", Math.round(canvasBackgroundColor.B));
	
	for (var n = 0; n < cubes.length; n++)
	{
		content += cubeSource(cubes[n]);
	}
	
	content = node("m", content);
	
	return content;
}

function keyRow(key, whatitdoes)
{
	var	content = "<tr>"
	
	content += "<td style='width:150px'>"	
	content += key;	
	content += "</td>"
	
	content += "<td style='width:150px'>"	
	content += whatitdoes;	
	content += "</td>"	
	
	content += "</tr>"
	
	return content;
}

function getKeys()
{
	var headStuff = "<head>" + 
					"<style>" + 
					"table, th, td {" + 
					"		border: 1px solid black;" + 
					"		border-collapse: collapse;" + 
					"		}" + 
					"</style>" + 
					"</head>";

	var content = headStuff;
						
	content += "<table cellpadding='8'>";
	
	content += keyRow("KEY", "FUNCTION");
	content += keyRow("+", "Zoom In");
	content += keyRow("+", "Zoom Out");
	content += keyRow("=", "Zoom Normal (return to default viewpoint)");
	content += keyRow("X", "Grow X (solid, facet, edge, vertex)");
	content += keyRow("x", "Shrink X (solid, facet, edge, vertex)");
	content += keyRow("Y", "Grow Y (solid, facet, edge, vertex)");
	content += keyRow("y", "Shrink Y (solid, facet, edge, vertex)");
	content += keyRow("Z", "Grow Z (solid, facet, edge, vertex)");
	content += keyRow("z", "Shrink Z (solid, facet, edge, vertex)");
	content += keyRow("A", "Grow XYZ (solid, facet, edge, vertex)");
	content += keyRow("a", "Shrink XYZ (solid, facet, edge, vertex)");

	content += keyRow("CTRL + X", "Slide increase X (solid, facet, edge, vertex)");
	content += keyRow("CTRL + x", "Slide decrease X (solid, facet, edge, vertex)");
	content += keyRow("CTRL + Y", "Slide increase Y (solid, facet, edge, vertex)");
	content += keyRow("CTRL + y", "Slide decrease Y (solid, facet, edge, vertex)");
	content += keyRow("CTRL + z", "Slide increase Z (solid, facet, edge, vertex)");
	content += keyRow("CTRL + Z", "Slide decrease Z (solid, facet, edge, vertex)");

	content += keyRow(">", "Expand along normal (facets)");
	content += keyRow("<", "Contract along normal (facets)");
	content += keyRow("e", "Extrude (facets) individual");
	content += keyRow("g", "Extrude (facets) as group");
	content += keyRow("E", "Extrude (facets) as series (repeated extrude)");
	content += keyRow("b", "Bevel (facet)");
	content += keyRow("i", "Indent (facet)");
	content += keyRow("p", "Split (edge)");
	content += keyRow("s", "Smooth (solid)");
	content += keyRow("( and )", "Rotate X (solid, facet, edge, vertex)");
	content += keyRow("[ and ]", "Rotate Y (solid, facet, edge, vertex)");
	content += keyRow("{ and }", "Rotate Z (solid, facet, edge, vertex)");
	content += keyRow("/ and \\", "Twist (facet around normal)");
	content += keyRow("? and |", "Bend (tilt facet around middle, +ALT for corners, +CTRL for alt sides or alt corners)");
	content += keyRow("(arrow keys)", "Shift model in window");
	content += keyRow("(arrow keys + CTRL)", "Rotate model in window");
	
	content += "</table>";
	
	return content;
}

function getHelp()
{
	var headStuff = "<head>" + 
					"<style>" + 
					"table, th, td {" + 
					"		border: 1px solid black;" + 
					"		border-collapse: collapse;" + 
					"		}" + 
					"</style>" + 
					"</head>";

	var content = headStuff + "This program lets you make 3D models using subdivision surface modeling. Solids are made of facets. Each facet has four edges. Each edge has two vertices.<BR/><BR/>";

	content += "A cube is a type of solid with six facets. You can complicate a cube's shape by extruding facets, by moving facets, edges, and vertices, and by smoothing.<BR/><BR/>";
	
	content += "There are two windows, the Edit window and the View window. To turn them on and off, use the Edit and View checkboxes on the row of checkbox options near the top.<BR/><BR/>";
	
	content += "Many commands can be done with keystrokes. To see a list of keystroke commands, click the Keys button on the left.<BR/><BR/>";
	
	content += "Tools only work in the Edit window. Facets, edges, vertices, and solids can only be selected in the Edit window. Click the tool buttons at top left to choose the right tool to edit solids, facets, edges, and vertices.<BR/><BR/>";
	
	content += "<table width='60%' cellpadding='8'>";
	
	content += keyRow("TOOL", "FUNCTION");
	content += keyRow("Slider", "Click + drag to slide the view. Right click + drag to rotate the view. Shift + left button drag to zoom in or out. These actions apply to both the Edit window and the View window. They work in the View window no matter what tool is selected.");
	content += keyRow("Solid", "Click to select solids. Click open area to deselect all. Click and drag to move solids (grid should be displayed when moving solids). Right click for a context menu of valid operations on solids.");
	content += keyRow("Facet", "Click to select facets. Click open area to deselect all. Click + drag of unselected facet selects multiple. Click and drag in open area starts net select of facets. Click and drag on selected facets moves facets (grid should be displayed when moving). Right click to display menu of facet commands.");
	content += keyRow("Edge", "Click to select edge, click open area to deselect all. Click + drag selected edges to move. Right click for edge commands menu.");
	content += keyRow("Vertex", "Click to select vertex, click open area to deselect all. Click + drag to move selected vertices. Right click for vertex commands.");
	content += keyRow("Draw", "Grid should be displayed. Click + drag a rectangle on the grid to draw a new solid with one single facet. You can use the Slab command on the Facet context menu to make this facet into a cube.");
	content += keyRow("All Tools", "Right click + drag in open area rotates view.");
	
	content += "</table>";

	content += "<BR/><BR>";

	content += "There is a row of option check boxes along the top side which affect how models are displayed in the EDIT and VIEW panes.";
	
	content += "<BR/><BR>";
	
	content += "<table width='60%' cellpadding='8'>";
	
	content += keyRow("OPTION", "FUNCTION");
	content += keyRow("Shade", "Check this box to fill and shade facets in the EDIT window. Uncheck to show only outlines.");
	content += keyRow("Normals", "Check this option to show normals in the EDIT window.");
	content += keyRow("Outline", "Check this option to show facet outlines in the EDIT window.");
	content += keyRow("Grid", "Check this option to show the grid in the EDIT window. This helps maintain orientation when moving facets, edges, and vertices. The grid flips to the X, Y or Z plane when you rotate the scene. Changing color of the grid indicates which plane it is in.");
	content += keyRow("Clear", "Check this option to show transparent facets in the EDIT window.");
	content += keyRow("Dual", "Check this option to show two-sided facets in the EDIT window. Uncheck it to show only the outward-facing side.");
	content += keyRow("Edit", "Check this option to show the EDIT pane. You can view the EDIT pane, the VIEW pane, or both at once.");
	content += keyRow("View", "Check this option to show the VIEW pane. There is no editing in the VIEW pane. Textures, Phong shading, and other features of rasterized 3D graphics can be shown in the VIEW pane.");
	content += keyRow("Texture", "Check this option to show textures in the VIEW pane.");
	content += keyRow("Specular", "Check this option to show specular highlights in the VIEW pane (specular highlights are not shown when using flat shading).");
	content += keyRow("Shader", "Use this dropdown to choose the current shader used for the VIEW pane.");
	
	content += "</table>";
	
	content += "<BR/><BR>";
	
	content += "<BR/><BR/>To get started, use the facet tool to select one or more facets, and right click to see the menu, then Extrude facets using the Extrude command to alter the shape. Then pick the Solid tool, right click the solid and choose Smooth command to create a subdivision surface.";
	
	content += "<BR/><BR/>Try to avoid creating internal or double walls. When extruding adjacent facets, use the Extrude Group command if the facets are facing the same direction. This will prevent forming internal walls between adjacent facets. When using the Tunnel or Indent command, you should bevel the facet first to avoid doubling walls.";
	
	content += "<BR/><BR/>To vary the smoothness of edges when using the Smooth command, add edge loops to your model. To make an edge loop, select an edge and use the Split command on the Edge menu. To move the edge loop, select one edge of the loop and then use the Edge Loop command to select the entire loop. You can then position the loop by click + dragging with the Edge tool. The grid should be displayed when dragging edge loops.";
	
	content += "<BR/><BR/>Another way to make an edge loop is to use the Bevel command to bevel a facet. This produces a smaller facet inset into the first facet. Yet another way is to extrude a facet and enter some small amount for the distance to extrude.";
	
	content += "<BR/><BR/>To see how this works, start with a cube (click F5 to refresh the page and start over). Using the Solid tool, right click and pick the Smooth command. If you do this three times, you will wind up with a sphere. Now press F5 to start over again. This time, choose the Facet tool and extrude one facet. Enter 100 for the amount and click OK (you may not even detect anything has happened unless you have the Outlines option checked). Now use the Solid tool to smooth the solid three times as before. Because of the edge loop you created, you will now end up with a gumdrop shape instead of a sphere.";
	
	content += "<BR/><BR/>Working with edge splits and edge loops is easier if the Outlines option is checked. This makes it easier to see divisions between adjacent facets.";
		
	content += "<BR/><BR/>The View window allows you to see shapes in WegGL with smooth shading and textures. Any tool can be used to rotate, pan and zoom the View window. To use smooth (Phong) shading, click the Phong option checkbox. To see textures, click the Textures option checkbox. These options only apply to the View window. The rest of the option checkboxes only apply to the Edit window.";

	content += "<BR/><BR/>Textures for solids and for regions of facets can be chosen using the Texture command on the context menus for solids and facets. For facets, you can enter a number between 0 and 1 for X and Y extent. These indicate the fractional portion of the texture images that will be used to paint the selected facets.";

	content += "<BR/><BR/>";	


	// solid context menu
	content += "<table width='60%' cellpadding='8'>";
	
	content += keyRow("SOLID CONTEXT MENU COMMANDS", "");
	content += keyRow("COMMAND", "FUNCTION");
	content += keyRow("Clone", "Create a duplicate solid.");
	content += keyRow("Delete", "Delete this solid.");
	content += keyRow("Smooth", "Apply the Catmull-Clark subdivision surface algorithm to this solid.");
	content += keyRow("Revert", "Revert solid to the base point facet state before any Smooth commands were applied.");
	content += keyRow("Freeze", "Make the current subdivision surface the new base point to return to for any future Revert commands.");
	content += keyRow("Mirror", "Create a new solid which is a mirror image of the first across some axis (enter X, Y, or Z).");
	content += keyRow("Reflect", "Create a new solid which is a mirror image of the first across some axis (enter X, Y, or Z). Combines the two solids into a single solid. Where possible merges the two solids by erasing facets which cross the axis and joining across the gaps.");
	content += keyRow("Combine", "Combine selected solids into a single solid.");
	content += keyRow("Color", "Set solid color.");
	content += keyRow("Outline Color", "Set outline color for selected solid.");
	content += keyRow("Texture", "Set texture for selected solid (only visible in View window).");
	content += keyRow("Unify", "Make all facets in solid have the same winding direction.");
	
	content += "</table>";
	
	content += "<BR/><BR/>";	
	
	// facet context menu
	content += "<table width='60%' cellpadding='8'>";
	
	content += keyRow("FACET CONTEXT MENU COMMANDS", "");
	content += keyRow("COMMAND", "FUNCTION");
	content += keyRow("Extrude", "Raise each selected facet individually along its normal and add walls.");
	content += keyRow("Extrude Group", "Raise selected facets as a group along average normal and add exterior walls. Works well when the group of facets faces more or less a common direction. When the group of facets selected is concentric or wraps around, use the Bevel or Flare command instead.");
	content += keyRow("Extrude Series", "Extrude selected facets singly or in groups, repeated X number of times, with scaling, bends, and rotation. Length, Scale, Tilt, Bend, Twist and Shift can be given as single values or lists of values separated by spaces, plus optional 's' for stepped or 'c' for continuous. If a single edge of a facet is seleced, Bend will bend toward that edge.");
	content += keyRow("Bevel", "Make a smaller facet within the same plane as the original, with connecting frame facets. This command can be used on groups of facets. Works like Extrude Group except it shrinks the group of facets instead of translating them along an average normal.");
	content += keyRow("Flare", "Make a larger facet raised up from the original, with connecting frame facets. This command can be used on groups of facets. Works like Extrude Group except it grows the group of facets instead of translating them along an average normal.");
	content += keyRow("Delete", "Delete selected facets.");
	content += keyRow("Reverse", "Reverse order of vertices in the facet.");
	content += keyRow("Raise", "Raise the facet but without adding walls.");
	content += keyRow("Indent", "Like extrude, but in the opposite direction.");
	content += keyRow("Bridge", "Like Extrude, but deletes original facet leaving only the walls.");
	content += keyRow("Tunnel", "Like Indent, but deletes original facet leaving only the walls.");
	content += keyRow("Slab", "Like extrude, but duplicates the original facet in place, forming a cube from an isolated facet.");
	content += keyRow("Texture", "Set texture for selected facets (only visible in View window). Enter numbers between 0 and 1 for portion of texture image to use.");
	
	content += "</table>";
	
	content += "<BR/><BR/>";	
	
	// edge context menu
	content += "<table width='60%' cellpadding='8'>";
	
	content += keyRow("EDGE CONTEXT MENU COMMANDS", "");
	content += keyRow("COMMAND", "FUNCTION");
	content += keyRow("Split", "Split adjacent facets perpendicular to the single selected edge, forming a loop.");
	content += keyRow("Edge Loop", "Select edges, forming a selected loop containing the single selected edge.");
	content += keyRow("Facet Loop", "Select facets, forming a selected loop containing the two facets adjacent to the single selected edge.");
	
	content += "</table>";
	
	
	content += "<BR/><BR/>";	
	
	// vertex context menu
	content += "<table width='60%' cellpadding='8'>";
	
	content += keyRow("VERTEX CONTEXT MENU COMMANDS", "");
	content += keyRow("COMMAND", "FUNCTION");
	content += keyRow("Knit (4 vertices selected)", "Make a facet from the 4 vertices.");
	content += keyRow("Knit (8 vertices selected)", "Make four walls to connect the 8 vertices, forming a tunnel. Vertices must belong to a single solid (use Combine command to combine different solids).");
	
	content += "</table>";
	
	
	
	return content;
}

function cubeSource(c)
{
	var content = "";
	
	content += node("r", Math.round(c.color.R));
	content += node("g", Math.round(c.color.G));
	content += node("b", Math.round(c.color.B));
	
	content += node("or", Math.round(c.outlineColor.R));
	content += node("og", Math.round(c.outlineColor.G));
	content += node("ob", Math.round(c.outlineColor.B));
	
	for (var n = 0; n < c.facets.length; n++)
	{
		content += facetSource(c.facets[n]);
	}

	content += node("ns", Math.round(c.nSubdivide)); // number of subdivisions
	
	content += node("tx", c.textureName);
	
	content = node("c", content);
	
	return content;
}

function facetSource(facet)
{
	var content = "";
	
	for (var b = 0; b < facet.points.length; b++)
	{
		content += pointSource(facet.points[b]);		
	}
	
	content = node("f", content);
	
	return content;
}

function pointSource(point)
{
	var content = "";
	
	content += point.x + " ";
	content += point.y + " ";
	content += point.z;

	if (point.U != undefined && point.V != undefined)
	{
		content += " " + point.U + " ";
		content += point.V;
	}
	
	content += "|";
	
	return content
}

function gridWidth()
{
	return gridInterval * gridUnits;
}

function gridTopLeft()
{
	var w = gridWidth() / 2;
	return new Point3D(0 - w, 0 - w, 0);
}

function gridTopRight()
{
	var w = gridWidth() / 2;
	return new Point3D(0 + w, 0 - w, 0);
}

function gridBottomLeft()
{
	var w = gridWidth() / 2;
	return new Point3D(0 - w, 0 + w, 0);
}

function gridBottomRight()
{
	var w = gridWidth() / 2;
	return new Point3D(0 + w, 0 + w, 0);
}

function gridBack()
{
	var w = gridWidth() / 2;
	return new Point3D(0, 0, 0 - w);
}

function gridFront()
{
	var w = gridWidth() / 2;
	return new Point3D(0, 0, 0 + w);
}

function gridTop()
{
	var w = gridWidth() / 2;
	return new Point3D(0, 0 - w, 0);
}

function gridBottom()
{
	var w = gridWidth() / 2;
	return new Point3D(0, 0 + w, 0);
}

function gridLeft()
{
	var w = gridWidth() / 2;
	return new Point3D(0 - w, 0, 0);
}

function gridRight()
{
	var w = gridWidth() / 2;
	return new Point3D(0 + w, 0, 0);
}




var origin = new Point(-500, -300);

var TwoPi = Number(Math.PI * 2.0);
var FourPi = Number(Math.PI * 4.0);

var degreesX = 0;
var degreesY = 0;
var degreesZ = 0;
var radiansX = radians_from_degrees(degreesX);
var radiansY = radians_from_degrees(degreesY);
var radiansZ = radians_from_degrees(degreesZ);

var fieldOfViewGL = 45.0;

var zEyePlane = 40000;
var zViewingPlane = 20000;

var myCenter = new Point3D(0, 0, 0);
var cubeSize = 1800;

var reductionFactor = 2800.0;

var lightSource = new Point3D(100, 100, 100);
var frontSource = new Point3D(0, 0, 100);

var hitVertex = -1;
var hitVertexEdge = -1;
var selectedVertexes = [];

var hitLine = -1;
var selectedLines = [];

var movingEdge = false;
var movingVertex = false;
var movingSolid = false;

var movingFacets = false;
var hitFacet = -1;
var selectedFacets = [];

var hitSolid = -1;
var selectedSolids = [];

var draggingRect = false;

var fillColor;

var canvas = document.createElement('canvas');
var canvas2 = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var gl = null; // web gl context
var isGL = false;
var is2dWindow = true;
var isPolarUV = true;
var isTransparent = false;
var isTexture = false;

var isPhong = false;
var isComic = false;
var isComic2 = false;
var isTopo = false;
var isPBN = false;
var isHeatMap = false;
var isRainbow = false;
var isStripes = false;
var isChrome = false;
var isSmear = false;
var isSpecular = false;
var isRainbow2 = false;
var pos = new Point(0, 0);
var posGL = new Point(0, 0);
var previousPos = new Point(0, 0);
var previousPosGL = new Point(0, 0);
var lastClickPos = new Point(0, 0);
var mouseDownPos = new Point(0, 0);

var isOutline = true;
var isShade = false;
var isGrid = false;
var isNormals = false;
var isClear = false;
var isDualSided = false;

var lineColor = '#eeeeee';
var lineColorGrid = '#999999';
var lineColorGrid_ZY = '#994499';
var lineColorGrid_XZ = '#449999';
var lineColorShape = '#c0392b'

var menuX = 0;
var menuY = 0;
var menuItemHeight = 30;
var menuWidth = 140;
var menuIsDisplayed = false;
var menuItems = [];
var menuName = "";
var menuItemChosen = "";

var draggingShape = false;
var mouseIsDown = false;
var rightMouseIsDown = false;

var clickTime = 0;
var lastClickTime = 0;

function Facet()
{
	this.cube = -1;
	this.ID = -1;
	this.points = [];
	this.point1 = new Point(0, 0);
	this.point2 = new Point(0, 0);
	this.closed = false;
	this.fill = false;
	this.averagePoint3D = new Point3D(0, 0, 0);
	this.normal = -1;	
	
	this.edges = [];	
	this.neighbors = [];
	this.greatestRotatedZ = 0;
	this.greatestLeastRotatedZ = 0;
	this.averageRotatedZ = 0;
	
	this.boundsMin = new Point3D(0, 0, 0);
	this.boundsMax = new Point3D(0, 0, 0);
}

function Point(x, y)
{
	this.x = x;
	this.y = y;
}

function Point3D(x, y, z)
{
	this.x = x;
	this.y = y;
	this.z = z;
}

function getLightSourceAngle(normal)
{
	var angle = 0;
	
	if (normal != -1)
	{
		angle = normalize_radians(vectorAngle(lightSource, minusPoints(ToRotated(normal.end), ToRotated(normal.start))));
	}
	
	return angle;
}      

function getFrontSourceAngle(normal)
{
	var angle = 0;
	
	if (normal != -1)
	{
		angle = normalize_radians(vectorAngle(frontSource, minusPoints(ToRotated(normal.end), ToRotated(normal.start))));
	}
	
	return angle;
}      

function ShadeFacet(color, angle)
{
	var darken_range = 0.75;
	var lighten_range = 0.75;
	
	var result = new Color(color.R, color.G, color.B);

	if (angle > 180)
	{
		angle = 360 - angle;
	}

	if (angle > 90) // darken
	{
		var darken_amount = (angle - 90) / 90;
		darken_amount *= darken_range;

		var r = color.R - (color.R * darken_amount);
		var g = color.G - (color.G * darken_amount);
		var b = color.B - (color.B * darken_amount);

		r = Math.min(255, Math.max(0, r));
		g = Math.min(255, Math.max(0, g));
		b = Math.min(255, Math.max(0, b));
		
		result = new Color(r, g, b);
	}
	else // lighten
	{
		var lighten_amount = (90 - angle) / 90;
		lighten_amount *= lighten_range;

		var r = color.R + ((255 - color.R) * lighten_amount);
		var g = color.G + ((255 - color.G) * lighten_amount);
		var b = color.B + ((255 - color.B) * lighten_amount);

		r = Math.max(0, Math.min(255, r));
		g = Math.max(0, Math.min(255, g));
		b = Math.max(0, Math.min(255, b));
		
		result = new Color(r, g, b);
	}

	return result;
}

function normalize180(oldDegrees)
{
	var degrees = oldDegrees;
	
	while (degrees < -180)
	{
		degrees += 360;
	}
	while (degrees > 180)
	{
		degrees -= 360;
	}
	
	return degrees;
}

function ShowFacet(angle)
{
	var result = true;
	
	if (angle > 90) // darken
	{
		result = false;
	}

	return result;
}

function isMuchBigger(d1, d2)
{
	if (d1 > d2)
	{
		if ((d1 - d2) > (d1 / 3.0))
		{
			return true;
		}
	}
	
	return false;
}

function findGridOrientation()
{
	gridIsZY = false;
	gridIsXZ = false;
	
	var left = To2D(gridLeft());
	var right = To2D(gridRight());

	var front = To2D(gridFront());
	var back = To2D(gridBack());

	var top = To2D(gridTop());
	var bottom = To2D(gridBottom());
	
	if (isMuchBigger(distance(front, back), distance(left, right)))
	{
		gridIsZY = true;
	}
	
	if (gridIsZY)
	{
		if (isMuchBigger(distance(front, back), distance(top, bottom)))
		{
			gridIsXZ = true;
			gridIsZY = false;
		}
	}
	else
	{
		if (isMuchBigger(distance(left, right), distance(top, bottom)))
		{
			gridIsXZ = true;
		}
	}
}

function swapXZ(p)
{
	var temp = p.x;
	p.x = p.z;
	p.z = temp;
}

function swapYZ(p)
{
	var temp = p.y;
	p.y = p.z;
	p.z = temp;
}

function drawGridXY()
{
	var color = lineColorGrid;
	if (gridIsXZ)
	{
		color = lineColorGrid_XZ;
	}
	else if (gridIsZY)
	{
		color = lineColorGrid_ZY;
	}

	var gridWidth = gridUnits * gridInterval;
	var w = gridWidth / 2;

	var P1 = new Point3D(0 - w, 0 - w, 0);
	
	var P2 = new Point3D(w, 0 - w, 0);
	
	if (gridIsXZ)
	{
		swapYZ(P1);
		swapYZ(P2);
	}
	else if (gridIsZY)
	{
		swapXZ(P1);
		swapXZ(P2);
	}
	
	for (var i = 0; 
		i < gridUnits; 
		i++)
	{
		var line = [];
	
		line.push(P1);
		line.push(P2);
	
		drawPolygon3d(line, false, false, "", true, (i == gridUnits / 2) ? "red" : color)

		if (gridIsXZ)
		{
			P1.z += gridInterval;
			P2.z += gridInterval;
		}
		else
		{		
			P1.y += gridInterval;
			P2.y += gridInterval;
		}
	}
	
	drawPolygon3d(line, false, false, "", true, color)

	P1 = new Point3D(0 - w, 0 - w, 0);
	
	P2 = new Point3D(0 - w, w, 0);

	if (gridIsXZ)
	{
		swapYZ(P1);
		swapYZ(P2);
	}
	else if (gridIsZY)
	{
		swapXZ(P1);
		swapXZ(P2);
	}
	
	for (var i = 0; 
			i < gridUnits; 
			i++)
	{
		var line = [];
	
		line.push(P1);
		line.push(P2);
	
		drawPolygon3d(line, false, false, "", true, (i == gridUnits / 2) ? "red" : color)

		if (gridIsZY)
		{
			P1.z += gridInterval;
			P2.z += gridInterval;
		}
		else
		{
			P1.x += gridInterval;
			P2.x += gridInterval;
		}
	}
	
	drawPolygon3d(line, false, false, "", true, color)
}

function slope(p1, p2)
{
	if (Math.abs(p2.x - p1.x) < 0.0001)
	{
		return 0;
	}
	
	return (p2.y - p1.y) / (p2.x - p1.x);
}

function lineSameAs(line1, line2)
{
	if (pointSameAs(line1.start, line2.start) && pointSameAs(line1.end, line2.end))
	{
		return true;
	}

	if (pointSameAs(line1.start, line2.end) && pointSameAs(line1.end, line2.start))
	{
		return true;
	}

	return false;
}

function linesConnect(line1, line2)
{
	var n = 0;

	if (pointSameAs(line1.start, line2.start))
	{
		n++;
	}

	if (pointSameAs(line1.start, line2.end))
	{
		n++;
	}

	if (pointSameAs(line1.end, line2.start))
	{
		n++;
	}

	if (pointSameAs(line1.end, line2.end))
	{
		n++;
	}

	return n == 1;
}

function linesIntersect(line1, line2)
{
	var p = intersectLines2D(line1.start, line1.end, line2.start, line2.end);
	
	if (p.x == -1 && p.y == -1)
	{
		return false;
	}
	else
	{
		return true;
	}
}

function deleteSelectedFacets()
{
	deleteFacets(selectedFacets);
		
	selectedFacets = [];

	updateModel();
	
	draw();
}

function deleteFacets(facets)
{
	for (var s = 0; s < facets.length; s++)
	{
		deleteFacet(facets[s]);
	}
		
	updateModel();
	
	draw();
}

function deleteSelectedSolids()
{
	for (var k = 0; k < selectedSolids.length; k++)
	{
		deleteSolid(selectedSolids[k]);
	}
	
	selectedSolids = [];
		
	updateModel();		
		
	draw();
}

function deleteSelected()
{
	if (selectedFacets.length > 0)
	{
		if (confirm("Delete selected facets?"))
		{
			cloneModel();
			deleteSelectedFacets();
		}
	}
	
	if (selectedSolids.length > 0)
	{
		if (confirm("Delete selected solids?"))
		{
			cloneModel();
			deleteSelectedSolids();
		}
	}
}

function deleteFacet(facet)
{
	if (facet != -1 && facet.cube != -1)
	{
		deleteFacetFromList(facet, facet.cube.facets);
	}
}

function deleteFacetFromList(facet, facets)
{
	var found = -1;

	for (var i = 0; i < facets.length; i++)
	{
		if (facets[i] == facet)
		{
			found = i;
			break;
		}
	}
	
	if (found != -1)
	{
		facets.splice(found, 1);
		return true;
	}
	
	return false;
}

function deleteSolid(solid)
{
	var found = -1;
	
	if (solid != -1)
	{	
		for (var i = 0; i < cubes.length; i++)
		{
			if (cubes[i] == solid)
			{
				found = i;
				break;
			}
		}
	}
	
	if (found != -1 && solid != -1)
	{
		cubes.splice(found, 1);
	}
}

function combineSolids()
{
	includeHitSolid();

	var toDelete = [];
	
	if (selectedSolids.length > 1)
	{
		cloneModel();
		
		var firstSolid = selectedSolids[0];
		
		for (var k = 1; k < selectedSolids.length; k++)
		{
			for (var p = 0; p < selectedSolids[k].facets.length; p++)
			{
				selectedSolids[k].facets[p].cube = firstSolid;
				firstSolid.facets.push(selectedSolids[k].facets[p]);
			}
			
			toDelete.push(selectedSolids[k]);
		}
		
		for (var b = 0; b < toDelete.length; b++)
		{
			deleteSolid(toDelete[b]);
		}
		
		selectedSolids = [];
		
		sortFacets();
		
		draw();
	}
	else
	{
		alertUser("Select more than one solid to combine.");
	}
}

function setBackgroundColor()
{
	alertUser("");
	colorPickMode = "background";
	draw();	
}

function setLineColor()
{
	alertUser("");
	colorPickMode = "line";
	draw();	
}

function changeColor()
{
	alertUser("");
	colorPickMode = "solid";
	draw();	
}

function changeOutlineColor()
{
	alertUser("");
	colorPickMode = "line";
	draw();	
}

function doIndentFacets()
{
	hideInputForm();
	if (selectedFacets.length > 0)
	{		
		cloneModel();
		extrudeFacets(selectedFacets, false, false, false, true, 0.5);
		selectedFacets = [];
	}
 }

function doSlab()
{
	hideInputForm();
	if (selectedFacets.length > 0)
	{		
		cloneModel();
		extrudeFacets(selectedFacets, false, true);
		selectedFacets = [];
	}
}
 
function doTunnel()
{
	hideInputForm();
	if (selectedFacets.length > 0)
	{		
		cloneModel();
		extrudeFacets(selectedFacets, false, false, true, true);
		selectedFacets = [];
	}
}

function doBridge()
{
	hideInputForm();
	if (selectedFacets.length > 0)
	{		
		cloneModel();
		extrudeFacets(selectedFacets, false, false, true, false);
		selectedFacets = [];
	}
}

function doExtrudeFacets(asGroup)
{
	hideInputForm();
	if (selectedFacets.length > 0)
	{		
		cloneModel();
		extrudeFacets(selectedFacets, asGroup);
		selectedFacets = [];
	}
}

function doExtrudeGroup()
{
	hideInputForm();
	if (selectedFacets.length > 0)
	{		
		cloneModel();
		extrudeFacets(selectedFacets, true);
		selectedFacets = [];
	}
}

function doTilt(axis, tilt, facetList, CENTER)
{
	var axisPoint;
	
	if (axis.length > 0 && tilt != 0.0)
	{
		if (axis == "X")
		{
			axisPoint = new Point3D(1, 0, 0)
		}
		else if (axis == "Y")
		{
			axisPoint = new Point3D(0, 1, 0)
		}
		else if (axis == "Z")
		{
			axisPoint = new Point3D(0, 0, 1)
		}
		
		rotateFacetList(facetList, false, axisPoint, tilt, CENTER)
	}
}

function doBend(amount, facetList, horizontal, vertical, edgeIndex, bendDirection)
{
	rotateFacetsAroundEdge(facetList, amount * bendDirection, edgeIndex, false, false, vertical, horizontal);
}

function doTwist(amount, facetList)
{
	if (amount != 0.0)
	{
		rotateFacetsAroundNormal(facetList, amount);
	}
}

function findSelectedEdge(facet)
{
	facet.edges = getFacetLines(facet);
	
	for (var i = 0; i < facet.edges.length; i++)
	{
		for (var k = 0; k < selectedLines.length; k++)
		{
			if (lineSameAs(selectedLines[k], facet.edges[i]))
			{
				return i;
			}
		}
	}
	
	return -1;
}

function findBendDirection(facet)
{
	if (facet.selectedEdgeIndex > -1)
	{
		var p1 = clonePoint3D(facet.normal.start);
		var p2 = clonePoint3D(facet.normal.start);
		
		var edge = facet.edges[facet.selectedEdgeIndex];
		
		rotateOnePointAroundAxis(p1, edge, 90)
		rotateOnePointAroundAxis(p2, edge, -90)
		
		var d1 = distance3(facet.normal.end, p1);
		var d2 = distance3(facet.normal.end, p2);
		
		if (d1 > d2)
		{
			return -1;
		}
	}
	
	return 1;
}

function repeatExtrude()
{
	var cloneOriginal = false;
	var eraseOriginal = false;
	var tunnel = false;
	var amount = 1;
	var bevel = false;
	var repeat = true;
	
	nExtrudeSeries = document.getElementById("repeatExtrudeNumber").value;	
	asGroupExtrudeSeries = document.getElementById("repeatExtrudeAsGroup").checked;
	scaleString = document.getElementById("repeatExtrudeGrow").value;
	lengthString = document.getElementById("repeatExtrudeLength").value;
	tiltStringX = document.getElementById("repeatExtrudeTiltX").value;
	tiltStringY = document.getElementById("repeatExtrudeTiltY").value;
	tiltStringZ = document.getElementById("repeatExtrudeTiltZ").value;
	bendString = document.getElementById("repeatExtrudeBend").value;
	bendHorizontal = document.getElementById("repeatExtrudeBendHorizontal").checked;
	bendVertical = document.getElementById("repeatExtrudeBendVertical").checked;
	twistString = document.getElementById("repeatExtrudeTwist").value;
	shiftXString = document.getElementById("repeatExtrudeShiftX").value;
	shiftYString = document.getElementById("repeatExtrudeShiftY").value;
	shiftZString = document.getElementById("repeatExtrudeShiftZ").value;

	cloneModel();

	var previousGroupTiltCenter = null;
	
	for (var bk = 0; bk < selectedFacets.length; bk++)
	{
		selectedFacets[bk].selectedEdgeIndex = findSelectedEdge(selectedFacets[bk]);
		selectedFacets[bk].bendDirection = findBendDirection(selectedFacets[bk]);
	}
	
	var N = nExtrudeSeries;
	
	for (var i = 0; i < N; i++)
	{
		var length = varyExtrudeProperty(lengthString, N, i, false);
		var bend = varyExtrudeProperty(bendString, N, i, true);
		var tiltX = varyExtrudeProperty(tiltStringX, N, i, true);
		var tiltY = varyExtrudeProperty(tiltStringY, N, i, true);
		var tiltZ = varyExtrudeProperty(tiltStringZ, N, i, true);
		var scale = varyExtrudeProperty(scaleString, N, i, false);
		var shiftX = varyExtrudeProperty(shiftXString, N, i, true);
		var shiftY = varyExtrudeProperty(shiftYString, N, i, true);
		var shiftZ = varyExtrudeProperty(shiftZString, N, i, true);
		var twist = varyExtrudeProperty(twistString, N, i, true);
	
		extrudeFacets(selectedFacets, asGroupExtrudeSeries, 
					  cloneOriginal, eraseOriginal, tunnel, amount, bevel, scale, repeat, length, shiftX, shiftY, shiftZ);
	
		if (i > 0) // complete previous tilt/bends (takes two operations to get the angle right)
		{
			if (asGroupExtrudeSeries)
			{
				if (previousGroupTiltCenter != null)
				{				
					doTilt("X", tiltX / 2.0, selectedFacets, previousGroupTiltCenter);
					doTilt("Y", tiltY / 2.0, selectedFacets, previousGroupTiltCenter);
					doTilt("Z", tiltZ / 2.0, selectedFacets, previousGroupTiltCenter);
				}
			}
			else
			{
				for (var oo = 0; oo < selectedFacets.length; oo++)
				{
					if (selectedFacets[oo].previousAxis != undefined)
					{
						// we tilt a facet half the bend amount, twice,
						// once around previous axis and once around current axis, to even out the angles
						rotateFacetAroundAxis(selectedFacets[oo].previousAxis, selectedFacets[oo], bend / 2.0);
					}
					
					if (selectedFacets[oo].previousTiltCenter != undefined)
					{
						var facet = oneFacetList(selectedFacets[oo]);
						doTilt("X", tiltX / 2.0, facet, selectedFacets[oo].previousTiltCenter);
						doTilt("Y", tiltY / 2.0, facet, selectedFacets[oo].previousTiltCenter);
						doTilt("Z", tiltZ / 2.0, facet, selectedFacets[oo].previousTiltCenter);				
					}
				}
			}
			updateModel();
		}

		if (i < N - 1)
		{
			if (asGroupExtrudeSeries)
			{
				previousGroupTiltCenter = averageFacetPoint(getFacetListPoints(selectedFacets));
				doTilt("X", tiltX / 2.0, selectedFacets, previousGroupTiltCenter);
				doTilt("Y", tiltY / 2.0, selectedFacets, previousGroupTiltCenter);
				doTilt("Z", tiltZ / 2.0, selectedFacets, previousGroupTiltCenter);
			}
			else
			{
				for (var o = 0; o < selectedFacets.length; o++)
				{
					var facet = oneFacetList(selectedFacets[o]);
					selectedFacets[o].previousTiltCenter = averageFacetPoint(getFacetListPoints(facet));
					doTilt("X", tiltX / 2.0, facet, selectedFacets[o].previousTiltCenter);
					doTilt("Y", tiltY / 2.0, facet, selectedFacets[o].previousTiltCenter);
					doTilt("Z", tiltZ / 2.0, facet, selectedFacets[o].previousTiltCenter);				
					doBend(bend / 2.0, facet, bendHorizontal, bendVertical, facet[0].selectedEdgeIndex, facet[0].bendDirection);
					doTwist(twist, facet);
				}
			}
		}		
	}

	for (var ooo = 0; ooo < selectedFacets.length; ooo++)
	{
		selectedFacets[ooo].previousAxis = undefined;
		selectedFacets[ooo].previousTiltCenter = undefined;
		selectedFacets[ooo].selectedEdgeIndex = undefined;
		selectedFacets[ooo].bendDirection = undefined;
	}
	
	selectedFacets = [];
	
	hideInputForm("genericPopup");
}

function extrudeFacets(targetFacets, asGroup, cloneOriginal, eraseOriginal, tunnel, amount, bevel, 
			growAmount, repeat, length, shiftX, shiftY, shiftZ)
{
	if (targetFacets.length > 0)
	{				
		updateCube(targetFacets[0].cube);
	
		var bevelIsCentered = false;
		
		if (growAmount == undefined)
		{
			growAmount = 0.75;
		}
	
		if (amount == undefined)
		{
			amount = 1;
		}
		
		if (bevel == undefined)
		{
			bevel = false;
		}
		
		if (asGroup == undefined)
		{
			asGroup = false;
		}
		
		if (cloneOriginal == undefined)
		{
			cloneOriginal = false;
		}
		
		if (eraseOriginal == undefined)
		{
			eraseOriginal = false;
		}
		
		if (tunnel == undefined)
		{
			tunnel = false;
		}
	
		var distance = "";

		if (bevel == false)
		{
			distance = getInputValue();
			
			if (length != undefined)
			{
				distance = length;
			}

			if (distance == "" || distance == "0")
			{
				return;
			}
			else
			{
				distance = Number(distance);
				
				if (distance == 0)
				{
					return;
				}
			}
		}		
		else		
		{
			// this is a bevel, so use the distance to move it clear before shrinking...
			distance = (Number(cubeSize * 2)) + 14;  // +14 is to prevent vertex fusing (in most cases)
													 // with adjacent previously extruded facets of standard amount
		}
	
		findFacetNeighborsAndAdjacents(targetFacets);
		findFacetNeighborsAndAdjacents(targetFacets[0].cube.facets);
		
		var allNormalPoints = [];
		for (var s1 = 0; s1 < targetFacets.length; s1++)
		{
			var selectedFacet = targetFacets[s1];
		
			selectedFacet.normal = CalculateNormal(selectedFacet);

			var p1 = new Point3D(
					selectedFacet.normal.end.x - selectedFacet.normal.start.x,
					selectedFacet.normal.end.y - selectedFacet.normal.start.y,
					selectedFacet.normal.end.z - selectedFacet.normal.start.z
					);

			allNormalPoints.push(p1);
		}

		var avgP = averageFacetPoint(allNormalPoints); // avg. difference between normal begin and end

		if (bevel)
		{
			if (Math.abs(avgP.x) < 20 && Math.abs(avgP.y) < 20 && Math.abs(avgP.z) < 20)
			{
				bevelIsCentered = true;
			}
		}

		// make a vector the required distance in length but same direction as average normal
		avgP = roundPoint(LengthPoint(new line(new Point3D(0, 0, 0), avgP), distance));	
		if (bevelIsCentered)
		{
			avgP.x = distance; // have to force movement
		}

		var p;
		
		for (var s = 0; s < targetFacets.length; s++)
		{
			var selectedFacet = targetFacets[s];
		
			if (selectedFacet != -1)
			{
				var cube = selectedFacet.cube;
			
				selectedFacet.normal = CalculateNormal(selectedFacet);

				var newFacets = [];
				
				newFacets.push(new Facet());
				newFacets.push(new Facet());
				newFacets.push(new Facet());
				newFacets.push(new Facet());
			
				if (!asGroup || s == 0)
				{
					p = new Point3D(
						selectedFacet.normal.end.x - selectedFacet.normal.start.x,
						selectedFacet.normal.end.y - selectedFacet.normal.start.y,
						selectedFacet.normal.end.z - selectedFacet.normal.start.z
						);		

					p = roundPoint(LengthPoint(new line(new Point3D(0, 0, 0), p), distance));		
						
					if (asGroup)
					{
						p = avgP;
					}
						
					if (tunnel)
					{
						p.x *= -1;
						p.y *= -1;
						p.z *= -1;
					}				
					
					p.x *= amount;
					p.y *= amount;
					p.z *= amount;
				}

				var lines = getFacetLines(selectedFacet);
			
				for (var n = 0; n < newFacets.length; n++)
				{
					var ns = newFacets[n];

					var l = lines[n];
					
					if (!asGroup || !isLineInFacetList(l, targetFacets, selectedFacet))
					{
						ns.cube = cube;
						cube.facets.push(ns);
						
						ns.points.push(clonePoint3D(l.start));
						ns.points.push(clonePoint3D(l.end));
						ns.points.push(new Point3D(l.end.x + p.x, l.end.y + p.y, l.end.z + p.z));
						ns.points.push(new Point3D(l.start.x + p.x, l.start.y + p.y, l.start.z + p.z));
						
						ns.normal = CalculateNormal(ns);
					}										
				}						
			}
		}


		for (var s = 0; s < targetFacets.length; s++)
		{
			var selectedFacet = targetFacets[s];
		
			var cube = selectedFacet.cube;
		
			selectedFacet.normal = CalculateNormal(selectedFacet);

			if (!asGroup || s == 0)
			{
				var p = new Point3D(
					selectedFacet.normal.end.x - selectedFacet.normal.start.x,
					selectedFacet.normal.end.y - selectedFacet.normal.start.y,
					selectedFacet.normal.end.z - selectedFacet.normal.start.z
					);		

				p = roundPoint(LengthPoint(new line(new Point3D(0, 0, 0), p), distance));		
					
				if (asGroup)
				{
					p = avgP;
				}
					
				if (tunnel)
				{
					p.x *= -1;
					p.y *= -1;
					p.z *= -1;
				}

				p.x *= amount;
				p.y *= amount;
				p.z *= amount;
			}
							
			if (cloneOriginal)
			{
				var f = cloneFacet(selectedFacet, true);
				f.normal = CalculateNormal(f);
				cube.facets.push(f);
			}
			
			raiseFacet(cube, selectedFacet, p);
			
			selectedFacet.normal = CalculateNormal(selectedFacet);			
		}

		if (bevel)
		{
			growFacets(targetFacets, growAmount);
			
			if (growAmount > 1) // flare
			{
				if (bevelIsCentered)
				{
					p = timesPoint(p, -1);
				}
				else
				{
					p = timesPoint(p, -0.8);
				}
			}
			else
			{
				p = timesPoint(p, -1);
			}
			moveFacets(targetFacets, p);
		}
		
		if (repeat)
		{
			if (asGroup)
			{
				growFacets(targetFacets, growAmount);
			}
			else
			{
				growFacetsIndividual(targetFacets, growAmount);
			}
		}
		
		if (eraseOriginal)
		{
			deleteFacets(targetFacets);
		}
		
		if (shiftX != undefined)
		{
			if (shiftX != 0.0)
			{
				moveFacets(targetFacets, new Point3D(shiftX, 0, 0));
			}
		}
		
		if (shiftY != undefined)
		{
			if (shiftY != 0.0)
			{
				moveFacets(targetFacets, new Point3D(0, shiftY, 0));
			}
		}
		
		if (shiftZ != undefined)
		{
			if (shiftZ != 0.0)
			{
				moveFacets(targetFacets, new Point3D(0, 0, shiftZ));
			}
		}
		
		if (targetFacets.length > 0)
		{
			fuseFaster(targetFacets[0].cube);
			updateCube(targetFacets[0].cube);
		}
			
		draw();
	}
	else
	{
		alertUser("Please select some facets.");
	}
	
	updateModel();
}

function alertUser(message)
{
	document.getElementById("errorDiv").innerHTML = "<font size='3' color='red'>" + message + "</font>";
}

function informUser(message)
{
	document.getElementById("errorDiv").innerHTML = "<font size='3' color='green'>" + message + "</font>";
}

function raiseFacetCommand()
{
	hideInputForm();
	
	var distance = getInputValue();
		
	if (distance == "" || distance == "0")
	{
		return;
	}
	else
	{
		distance = Number(distance);
		
		if (distance == 0)
		{
			return;
		}
	}
	if (selectedFacets.length < 1)
	{
		return;
	}
	
	cloneModel();
	
	for (var s = 0; s < selectedFacets.length; s++)
	{
		var selectedFacet = selectedFacets[s];
	
		if (selectedFacet != -1)
		{
			var p = new Point3D(selectedFacet.normal.end.x - selectedFacet.normal.start.x,
								selectedFacet.normal.end.y - selectedFacet.normal.start.y,
								selectedFacet.normal.end.z - selectedFacet.normal.start.z);		
				
			selectedFacet.normal = CalculateNormal(selectedFacet);
			
			p = roundPoint(LengthPoint(new line(new Point3D(0, 0, 0), p), distance));		
			
			raiseFacet(selectedFacet.cube, selectedFacet, p);
			
			selectedFacet.normal = CalculateNormal(selectedFacet);
			
		}
	}

	selectedFacets = [];
	
	sortFacets();
	
	draw();
}

function DegreesFromRotationPoint3D(axis, p, rotation_point)
{
	return degrees_from_radians(RadiansFromRotationPoint3D(axis, p, rotation_point));
}

// this is for getting the 3D rotation amount around one axis
function RadiansFromRotationPoint3D(axis, p, rotation_point)
{
	var rise;
	var run;
	
	if (axis == "x")
	{
		run = Number(p.y - rotation_point.y);
		rise = Number(p.z - rotation_point.z);
	}
	else if (axis == "y")
	{
		run = Number(p.z - rotation_point.z);
		rise = Number(p.x - rotation_point.x);	
	}
	else if (axis == "z")
	{
		run = Number(p.x - rotation_point.x);
		rise = Number(p.y - rotation_point.y);
	}

	var radians = Number(Math.atan2(rise, run));		
	return normalize_radians(radians);
}

function RadiansFromRotationPoint(p, rotation_point)
{
	var rise = (p.y - rotation_point.y);
	var run = (p.x - rotation_point.x);

	var radians = Math.atan2(rise, run);

	return radians;
}

function getTextureIndex(textureName)
{
	var n = 4;
	
	if (textureName == "steel")
	{
		n = 7;
	}
	if (textureName == "sky")
	{
		n = 6;
	}
	if (textureName == "paisley")
	{
		n = 5;
	}
	if (textureName == "wood")
	{
		n = 4;
	}
	if (textureName == "pebbles")
	{
		n = 3;
	}
	if (textureName == "grass")
	{
		n = 2;
	}
	if (textureName == "brick")
	{
		n = 1;
	}
	if (textureName == "stone")
	{
		n = 0;
	}
	
	return n;
}

function getTextureOffsetU(U, n)
{
	
	var segment = 1.0 / nTextures;
	var mini = n * segment;
	var maxi = mini + segment;

	var buffer = segment / 20;
	
	mini += buffer;
	maxi -= buffer;
	
	var result = mini;

	result += (U * (maxi - mini));
	
	return result;
}

function getVectorOrientation(vector)
{
	var x = Math.abs(vector.start.x - vector.end.x);
	var y = Math.abs(vector.start.y - vector.end.y);
	var z = Math.abs(vector.start.z - vector.end.z);

	return getMaxDimension(x, y, z);
}

function getMaxDimension(x, y, z)
{
	var max = Math.max(x, Math.max(y, z));
	
	if (max == x)
	{
		return "x";
	}
	if (max == y)
	{
		return "y";
	}
	if (max == z)
	{
		return "z";
	}
}

function getMinDimension(x, y, z)
{
	var min = Math.min(x, Math.min(y, z));
	
	if (min == x)
	{
		return "x";
	}
	if (min == y)
	{
		return "y";
	}
	if (min == z)
	{
		return "z";
	}
}

function assignRegionUV(facets, textureName, XExtent, YExtent)
{
	var n = getTextureIndex(textureName);

	var bounds = facetListBounds(facets);
	
	var points = getFacetListPoints(facets);
	
	var x = Math.abs(bounds.right - bounds.left);
	var y = Math.abs(bounds.bottom - bounds.top);
	var z = Math.abs(bounds.back - bounds.front);
	
	var minDim = getMinDimension(x, y, z);
	var dims = "xyz".replace(minDim, "");

	for (var s = 0; s < points.length; s++)
	{
		var p = points[s];
		
		if (dims == "xy")
		{
			p.U = (p.x - Math.min(bounds.left, bounds.right)) / Math.abs(bounds.right - bounds.left);
			p.V = (p.y - Math.min(bounds.top, bounds.bottom)) / Math.abs(bounds.bottom - bounds.top);
		}
		else if (dims == "xz")
		{
			p.U = (p.x - Math.min(bounds.left, bounds.right)) / Math.abs(bounds.right - bounds.left);
			p.V = (p.z - Math.min(bounds.front, bounds.back)) / Math.abs(bounds.back - bounds.front);
		}
		else if (dims == "yz")
		{
			p.U = (p.y - Math.min(bounds.top, bounds.bottom)) / Math.abs(bounds.bottom - bounds.top);
			p.V = (p.z - Math.min(bounds.front, bounds.back)) / Math.abs(bounds.back - bounds.front);
		}
		
		p.U *= XExtent;
		p.V *= YExtent;
		
		p.U = getTextureOffsetU(p.U, n);		
	}
}


function assignPolarUV_2(solid, n)
{
	var maxDegrees = 360;

	n = getTextureIndex(solid.textureName);

	var facets = solid.facets;

	var points = [];
	
	for (var s = 0; s < facets.length; s++)
	{
		var f = facets[s];

		for (var h = 0; h < f.points.length; h++)
		{
			points.push(f.points[h]);			
		}		
	}
	
	var center = averageFacetPoint(points);
	
	var bounds = leastAndMostFacetPointZ(points); // least and most Z contained in X, Y of point
	
	var r1 = new Point(center.x, center.y);

	for (var s = 0; s < facets.length; s++)
	{
		var f = facets[s];

		for (var g = 0; g < f.points.length; g++)
		{
			var p = f.points[g];
			
			if (p.U == undefined || p.V == undefined)
			{
				var p1 = new Point(p.x, p.y);
				
				var rads = RadiansFromRotationPoint(p1, r1);
				var degs = normalize_degrees(degrees_from_radians(rads));
				
				p.degs = degs;
			
				p.v = degs / 360.0;
						
				p.u = Math.abs(p.z - bounds.y) / Math.abs(bounds.y - bounds.x);

				if (p.u > 1.0)
				{
					p.u = 1.0;
				}
				if (p.u < 0.0)
				{
					p.u = 0.0;
				}
				
				p.u = getTextureOffsetU(p.u, n);
			}
			else
			{
				p.u = p.U;
				p.v = p.V;
			}
		}
		
		var m = fixFacetSpans360(f);
		
		if (m > maxDegrees)
		{
			maxDegrees = m;
		}		
	}	
	
	if (maxDegrees > 360)
	{
		for (var g = 0; g < points.length; g++)
		{
			var p = points[g];
			p.v = p.degs / maxDegrees;
		}
	}
}

function fixFacetSpans360(facet)
{
	var maxdegs = 0;
	
	var hasLess = false;
	var hasMore = false;
	
	for (var h = 0; h < facet.points.length; h++)
	{
		var p = facet.points[h];
		
		if (p.degs != undefined)
		{		
			if (p.degs < 60.0)
			{
				hasLess = true;
			}
			if (p.degs > 300.0)
			{
				hasMore = true;
			}
		}
	}
	
	if (hasLess && hasMore)
	{
		for (var h = 0; h < facet.points.length; h++)
		{
			var p = facet.points[h];
			
			if (p.degs < 60.0)
			{
				p.degs += 360.0;
				if (p.degs > maxdegs)
				{
					maxdegs = p.degs;
				}
			}
		}
	}
	
	return maxdegs;
}

function averageFacetNormal(facets)
{
	var points = [];
	
	for (var s = 0; s < facets.length; s++)
	{
		var f = facets[s];
			
		var p = new Point3D(f.normal.end.x - f.normal.start.x,
							f.normal.end.y - f.normal.start.y,
							f.normal.end.z - f.normal.start.z);		

		points.push(p);
	}
	
	return averageFacetPoint(points);
}

function inflateFacets(facets, amt)
{
	var p = averageFacetNormal(facets);
	
	p = LengthPoint(new line(new Point3D(0, 0, 0), p), amt);
	
	moveFacets(facets, p);	
}

function pointInLine(p, l)
{
	if (pointSameAs(p, l.start))
	{
		return true;
	}
	if (pointSameAs(p, l.end))
	{
		return true;
	}
	
	return false;
}

function cloneSelectedCubes()
{
	cloneModel();
	
	includeHitSolid();
	
	for (var s = 0; s < selectedSolids.length; s++)
	{
		cloneCube(selectedSolids[s], false);
	}

	updateModel();
	
	draw();
}

function showMirrorForm()
{
	showInputForm("Please enter a plane", "Accept", "X", mirrorSelectedCubes, false, "Plane: ", "") 
}

function getInputValue()
{
	return document.getElementById("inputname").value;
}

function getXTextureValue()
{
	return document.getElementById("xpercentinput").value;
}

function getYTextureValue()
{
	return document.getElementById("ypercentinput").value;
}

function getSelectedValue()
{
	return document.getElementById("picklist").value;
}

function getSelectedShader()
{
	return document.getElementById("picklistShader").value;
}

function setInputValue(s)
{
	document.getElementById("inputname").value = s;
}


function mirrorSelectedCubes()
{
	hideInputForm();
	
	var plane = getInputValue();

	includeHitSolid();
	
	var mirror;
	
	if (plane == "x" || plane == "X")
	{
		mirror = new Point3D(-1, 1, 1);
	}
	else if (plane == "y" || plane == "Y")
	{
		mirror = new Point3D(1, -1, 1)
	}
	else if (plane == "z" || plane == "Z")
	{
		mirror = new Point3D(1, 1, -1)
	}
	else
	{
		return;
	}

	cloneModel();
	
	for (var s = 0; s < selectedSolids.length; s++)
	{
		cloneCube(selectedSolids[s], true, mirror);
	}

	updateModel();
	
	draw();
}

function cloneCube(c, reverse, mirror)
{
	includeHitSolid();
	
	var c2 = new cube();
	c2.facets = [];

	for (var k = 0; k < c.facets.length; k++)
	{
		var f = cloneFacet(c.facets[k], reverse, mirror);
		
		c2.facets.push(f);
		
		f.cube = c2;
	}
	
	c2.color = new Color(c.color.R, c.color.G, c.color.B);
	cubes.push(c2);
	
	if (!mirror)
	{
		moveFacets(c2.facets, new Point3D(1000, 0, 0));
	}
}

function copyCube(c)
{
	var c2 = new cube();
	c2.facets = [];

	for (var k = 0; k < c.facets.length; k++)
	{
		var f = cloneFacet(c.facets[k], false);
		
		c2.facets.push(f);
		
		f.cube = c2;
	}
	
	c2.color = new Color(c.color.R, c.color.G, c.color.B);
	return c2;
}

function clearUndoRecord()
{
	previousCubeLists = [];
}

function cloneModel()
{
	eraseVertexNormals();
	
	var oldCubes = [];
	
	for (var w = 0; w < cubes.length; w++)
	{
		oldCubes.push(copyCube(cubes[w]));
	}
	
	previousCubeLists.push(oldCubes);
	
	if (previousCubeLists.length > 20)
	{
		previousCubeLists.shift();
	}
}

function undo()
{
	alertUser("");
	if (previousCubeLists.length > 0)
	{
		cubes = previousCubeLists.pop();
		
		hitVertex = -1;		
		hitVertexEdge = -1;
		hitLine = -1;
		hitFacet = -1;			
		hitSolid = -1;

		selectedVertexes = [];
		selectedLines = [];
		selectedFacets = [];
		selectedSolids = [];
		
		updateModel();
		draw();
	}
}

function reverseSelectedFacets()
{
	if (selectedFacets.length > 0)
	{	
		cloneModel();	
		reverseFacets(selectedFacets);
	}
}

function reverseFacets(facets)
{
	for (var k = 0; k < facets.length; k++)
	{
		facets[k].points.reverse();
	}
	
	updateModel();
}

function cloneFacet(f, reversePoints, mirror)
{
	if (reversePoints == undefined)
	{
		reversePoints = false;
	}
	
	var s1 = new Facet();
	
	for (var i = 0; i < f.points.length; i++)
	{
		var p = clonePoint3D(f.points[i]);
		
		if (mirror != undefined)
		{
			p = multiplyPoints(p, mirror);
		}
		
		s1.points.push(p);
	}
	
	if (reversePoints)
	{
		s1.points.reverse();
	}
	
	s1.cube = f.cube;
	
	s1.edges = getFacetLines(s1);
	
	s1.normal = CalculateNormal(s1);
	
	return s1;
}

function CalculateNormal(facet)
{
	var normal = -1;
	
	if (facet.points.length > 2)
	{
		var p0 = facet.points[0];
		var p1 = facet.points[1];
		var p2 = facet.points[2];
		
		var a = timesPoint(minusPoints(p1, p0), 8);
		var b = timesPoint(minusPoints(p2, p0), 8);

		normal = new line(clonePoint3D(p0), 
								new Point3D((a.y * b.z) - (a.z * b.y), // cross product
										  -((a.x * b.z) - (a.z * b.x)),
										    (a.x * b.y) - (a.y * b.x))
				);

		normal.end = LengthPoint(normal, cubeSize * 2);
		
		var avg =  averageFacetPoint(facet.points);
		
		normal.end.x += avg.x - normal.start.x;
		normal.end.y += avg.y - normal.start.y;
		normal.end.z += avg.z - normal.start.z;
		normal.start = avg;		
	}
	
	return normal;
}

function LengthPoint(myLine, newLength)
{
	var current_length = distance3(myLine.start, myLine.end);
	
	if (current_length < 0.001)
	{
		return clonePoint3D(myLine.start);
	}
	else
	{
		var fraction = newLength / current_length;
		
		var x = myLine.start.x + ((myLine.end.x - myLine.start.x) * fraction);
		var y = myLine.start.y + ((myLine.end.y - myLine.start.y) * fraction);
		var z = myLine.start.z + ((myLine.end.z - myLine.start.z) * fraction);

		return new Point3D(x, y, z);
	}
}

function hitDetectVertex(vert, mouse)
{
	var vertexLimit = 10;

	var p2 = To2D(vert);
	
	if (Math.abs(p2.x - mouse.x) < 10 && Math.abs(p2.y - mouse.y) < 10)
	{	
		return true;
	}	
}

function hitDetectFacet(p, facet)
{
	if (facet.points.length < 1)
	{
		return false;
	}
	
	var x = Math.round(p.x);
	var y = Math.round(p.y);

	var upline = new line(p, new Point(x, y - gridWidth()));
	var downline = new line(p, new Point(x, y + gridWidth()));
	var leftline = new line(p, new Point(x - gridWidth(), y));
	var rightline = new line(p, new Point(x + gridWidth(), y));
	
	var closedPoints = [];
	for (var i = 0; i < facet.points.length; i++)
	{
		closedPoints.push(facet.points[i]);
	}
	closedPoints.push(facet.points[0]);
	
	var nUp = 0;
	var nDown = 0;
	var nLeft = 0;
	var nRight = 0;
	
	for (var i = 1; i < closedPoints.length; i++)
	{
		var l = new line(To2D(closedPoints[i - 1]), To2D(closedPoints[i]));
		
		if (crosses(l, upline))
		{
			nUp++;
		}
	}	
	
	for (var i = 1; i < closedPoints.length; i++)
	{
		var l = new line(To2D(closedPoints[i - 1]), To2D(closedPoints[i]));
		
		if (crosses(l, downline))
		{
			nDown++;
		}
	}	
	
	for (var i = 1; i < closedPoints.length; i++)
	{
		var l = new line(To2D(closedPoints[i - 1]), To2D(closedPoints[i]));
		
		if (crosses(l, leftline))
		{
			nLeft++;
		}
	}	
	
	for (var i = 1; i < closedPoints.length; i++)
	{
		var l = new line(To2D(closedPoints[i - 1]), To2D(closedPoints[i]));
		
		if (crosses(l, rightline))
		{
			nRight++;
		}
	}	
	
	return nUp > 0 && nDown > 0 && nLeft > 0 && nRight > 0;	
}

function facetIsWithin(p1, p2, facet)
{
	for (var f = 0; f < facet.points.length; f++)
	{
		var p = To2D(facet.points[f]);
		
		if (isWithin(p1, p2, p))
		{
			return true;
		}
	}
	
	return false;
}

function isWithin(p1, p2, p)
{
	if (p.x >= Math.min(p1.x, p2.x) - 2)
	{
		if (p.y >= Math.min(p1.y, p2.y) - 2)
		{
			if (p.x <= Math.max(p1.x, p2.x) + 2)
			{
				if (p.y <= Math.max(p1.y, p2.y) + 2)
				{
					return true;
				}
			}
		}
	}

	return false;
}

function crosses(line1, line2)
{
	var p = intersectLines2D(line1.start, line1.end, line2.start, line2.end);

	if (p.x == -1 && p.y == -1)
	{
		return false;
	}
	else
	{
		if (isWithin(line1.start, line1.end, p)	&& isWithin(line2.start, line2.end, p))
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	
}

function getFacetListPoints(facets)
{
	var result = [];

	for (var s = 0; s < facets.length; s++)
	{
		for (var t = 0; t < facets[s].points.length; t++)
		{
			result.push(facets[s].points[t]);
		}
	}
	
	return result;
}

function getEdgeListPoints(edges)
{
	var result = [];

	for (var s = 0; s < edges.length; s++)
	{
		result.push(edges[s].start);
		result.push(edges[s].end);
	}
	
	return result;
}

function getEdgeListFacetPoints(edges)
{
	var result = [];

	for (var s = 0; s < edges.length; s++)
	{
		var f = edges[s].parentFacet;
		
		for (var g = 0; g < f.points.length; g++)
		{
			var p = f.points[g];
			
			if (pointSameAs(p, edges[s].start) && !listHas(result, p))
			{
				result.push(p);
			}
			else if (pointSameAs(p, edges[s].end) && !listHas(result, p))
			{
				result.push(p);
			}
		}	
	}
	
	return result;
}

function getFacetListAveragePoint(facets)
{
	return(averageFacetPoint(getFacetListPoints(facets)));
}

function getEdgeListAveragePoint(facets)
{
	return(averageFacetPoint(getEdgeListPoints(facets)));
}

function growPoints(cube, center, points, cubePoints, amount, directions, slideonly)
{
	if (directions == undefined)
	{
		directions = new Point3D(1, 1, 1);
	}

	for (var i = 0; i < points.length; i++)
	{
		var p = points[i];		
		var pOld = clonePoint3D(p);		

		if (slideonly)
		{
			if (directions.x == 1)
			{
				p.x = Math.round(p.x + amount);
			}
			if (directions.y == 1)
			{
				p.y = Math.round(p.y + amount);
			}
			if (directions.z == 1)
			{
				p.z = Math.round(p.z + amount);
			}
		}
		else
		{
			if (directions.x == 1)
			{
				p.x = Math.round(center.x + (amount * (p.x - center.x)));
			}
			if (directions.y == 1)
			{
				p.y = Math.round(center.y + (amount * (p.y - center.y)));
			}
			if (directions.z == 1)
			{
				p.z = Math.round(center.z + (amount * (p.z - center.z)));
			}
		}
		
		
		// now update the points in the cube that are the same as this point but are not this point
		for (var g = 0; g < cubePoints.length; g++)
		{
			if (!listHas(points, cubePoints[g]))
			{
				if (pointSameAs(pOld, cubePoints[g]))
				{
					cubePoints[g].x = p.x;
					cubePoints[g].y = p.y;
					cubePoints[g].z = p.z;
				}
			}
		}
	}
	
	updateCube(cube);	
	
	sortFacets();
}

function oneFacetList(facet)
{
	var facets = [];
	facets.push(facet);
	return facets;
}

function growFacets(facets, amount, directions, slideonly, noCubePointsUpdate)
{
	if (facets.length > 0)
	{
		var center = getFacetListAveragePoint(facets);
		var points = getFacetListPoints(facets);
			
		var c = facets[0].cube;
		var cubePoints = getFacetListPoints(c.facets);
		if (noCubePointsUpdate == true)
		{
			cubePoints = [];
		}
		
		growPoints(c, center, points, cubePoints, amount, directions, slideonly);		
	}	
}

function growFacetsIndividual(facets, amount, directions, slideonly, noCubePointsUpdate)
{
	if (facets.length > 0)
	{
		for (var i = 0; i < facets.length; i++)
		{
			var list = oneFacetList(facets[i]);
		
			center = getFacetListAveragePoint(list);
			var points = getFacetListPoints(list);
				
			var c = list[0].cube;
			var cubePoints = getFacetListPoints(c.facets);
			if (noCubePointsUpdate == true)
			{
				cubePoints = [];
			}
			
			growPoints(c, center, points, cubePoints, amount, directions, slideonly);		
		}
	}	
}

function growEdges(edges, amount, directions, slideonly)
{
	if (edges.length > 0)
	{
		var center = getEdgeListAveragePoint(edges);
		var points = getEdgeListFacetPoints(edges);
			
		var c = edges[0].parentFacet.cube;
		var cubePoints = getFacetListPoints(c.facets);
		
		growPoints(c, center, points, cubePoints, amount, directions, slideonly);		
	}	
}

function growVertices(points, amount, directions, slideonly)
{
	if (points.length > 1)
	{
		var center = averageFacetPoint(points);
			
		var c = getVertexCube(points[0]);
			
		var cubePoints = getFacetListPoints(c.facets);

		growPoints(c, center, points, cubePoints, amount, directions, slideonly);				
	}	
}

function growSelection(factor, directions, slideonly)
{
	if (!isEditing())
	{
		return;
	}

	if (selectedSolids.length > 0 || selectedFacets.length > 0 || selectedLines.length > 0 || selectedVertexes.length > 1)
	{
		cloneModel();
	}

	if (selectedSolids.length > 0)
	{
		for (var g = 0; g < selectedSolids.length; g++)
		{
			growFacets(selectedSolids[g].facets, factor, directions, slideonly);
		}
	}
	else if (selectedFacets.length > 0)
	{
		growFacets(selectedFacets, factor, directions, slideonly);
	}
	else if (selectedLines.length > 0)
	{
		growEdges(selectedLines, factor, directions, slideonly);
	}
	else if (selectedVertexes.length > 1)
	{
		growVertices(selectedVertexes, factor, directions, slideonly);
	}
	else
	{
		alertUser("Please select solids, facets, edges or vertices");
	}
	
	draw();
}

function slideSelected(directions, amount)
{
	growSelection(amount, directions, true);
}

function shrinkSelected(directions)
{
	growSelection(0.85, directions, false);
}

function growSelected(directions)
{
	growSelection(1.15, directions, false);
}

function bevelSelectedFacets()
{
	if (selectedFacets.length > 0)
	{
		cloneModel();

		extrudeFacets(selectedFacets, true, false, false, false, 1, true);
		selectedFacets = [];
		
		draw();
	}
}

function flareSelectedFacets()
{
	if (selectedFacets.length > 0)
	{
		cloneModel();

		extrudeFacets(selectedFacets, true, false, false, false, 1, true, 1.25);
		selectedFacets = [];
		
		draw();
	}
}

function intersectLines2D(l1p1, l1p2, l2p1, l2p2)
{
	var intersectPoint = new Point(-1, -1);

	var A1 = l1p2.y - l1p1.y;
	var B1 = l1p1.x - l1p2.x;
	var C1 = (A1 * l1p1.x) + (B1 * l1p1.y);

	var A2 = l2p2.y - l2p1.y;
	var B2 = l2p1.x - l2p2.x;
	var C2 = (A2 * l2p1.x) + (B2 * l2p1.y);

	var det = (A1 * B2) - (A2 * B1);

	if (det == 0) // lines are parallel
	{
		return intersectPoint;
	}
	else
	{
		var x = ((B2 * C1) - (B1 * C2)) / det;
		var y = ((A1 * C2) - (A2 * C1)) / det;

		intersectPoint = new Point(Math.round(x, 0), Math.round(y, 0));
	}

	return intersectPoint;
}

function between(x, y, line1, line2)
{
	x = Math.round(x);
	y = Math.round(y);

	var p = new Point(x, y);
	
	var upline = new line(p, new Point(p.x, p.y - gridWidth()));
	var downline = new line(p, new Point(p.x, p.y + gridWidth()));

	if (crosses(upline, line1) && crosses(downline, line2))
	{
		return true;
	}
	else if (crosses(upline, line2) && crosses(downline, line1))
	{
		return true;
	}
	
	return false;
}

function betweenVertical(x, y, line1, line2)
{
	x = Math.round(x);
	y = Math.round(y);

	var p = new Point(x, y);
	
	var leftline = new line(p, new Point(p.x - gridWidth(), p.y));
	var rightline = new line(p, new Point(p.x + gridWidth(), p.y));

	if (crosses(leftline, line1) && crosses(rightline, line2))
	{
		return true;
	}
	else if (crosses(leftline, line2) && crosses(rightline, line1))
	{
		return true;
	}
	
	return false;
}

function cloneLine(oldline)
{
	return new line(clonePoint(oldline.start), clonePoint(oldline.end));
}

function cloneLine3D(oldline)
{
	var newLine = new line(clonePoint3D(oldline.start), clonePoint3D(oldline.end));
	newLine.parentFacet = oldline.parentFacet;
	newLine.adjacentFacet = oldline.adjacentFacet;	
	return newLine;
}

function planeIntersect3D(x, y)
{
	var TL = gridTopLeft();
	var TR = gridTopRight();
	var BL = gridBottomLeft();
	var BR = gridBottomRight();

	if (gridIsXZ)
	{
		swapYZ(TL);
		swapYZ(TR);
		swapYZ(BR);
		swapYZ(BL);
	}
	else if (gridIsZY)
	{
		swapXZ(TL);
		swapXZ(TR);
		swapXZ(BR);
		swapXZ(BL);
	}

	var topLeftCorner = To2D(TL);
	var topRightCorner = To2D(TR);
	var bottomLeftCorner = To2D(BL);
	var bottomRightCorner = To2D(BR);

	var topLeftCorner3D = TL;
	var topRightCorner3D = TR;
	var bottomLeftCorner3D = BL;
	var bottomRightCorner3D = BR;
	
	var topLine = new line(clonePoint(topLeftCorner), clonePoint(topRightCorner));
	var bottomLine = new line(clonePoint(bottomLeftCorner), clonePoint(bottomRightCorner));

	var topLine3D = new line(clonePoint3D(topLeftCorner3D), clonePoint3D(topRightCorner3D));
	var bottomLine3D = new line(clonePoint3D(bottomLeftCorner3D), clonePoint3D(bottomRightCorner3D));
	
	lineDiv3D = new line(midPoint3D(topLeftCorner3D, bottomLeftCorner3D), midPoint3D(topRightCorner3D, bottomRightCorner3D));
	lineDiv = new line(To2D(lineDiv3D.start), To2D(lineDiv3D.end));

	var n = 0;

	var limit = 1000;
	
	while (n < limit)
	{			
		if (between(x, y, topLine, lineDiv)
			|| betweenVertical(x, y, topLine, lineDiv))
		{
			bottomLine3D = cloneLine3D(lineDiv3D);
			
			bottomLeftCorner3D = clonePoint3D(bottomLine3D.start);
			bottomRightCorner3D = clonePoint3D(bottomLine3D.end);
			
			bottomLeftCorner = To2D(bottomLeftCorner3D);
			bottomRightCorner = To2D(bottomRightCorner3D);
			
			bottomLine = new line(bottomLeftCorner, bottomRightCorner);
		}
		else
		{
			topLine3D = cloneLine3D(lineDiv3D);
			
			topLeftCorner3D = clonePoint3D(topLine3D.start);
			topRightCorner3D = clonePoint3D(topLine3D.end);			
			
			topLeftCorner = To2D(topLeftCorner3D);
			topRightCorner = To2D(topRightCorner3D);
			
			topLine = new line(topLeftCorner, topRightCorner);
		}
		
		if (distance(topLine.start, bottomLine.start) < 3)
		{
			break;
		}
			
		lineDiv3D = new line(midPoint3D(topLeftCorner3D, bottomLeftCorner3D), midPoint3D(topRightCorner3D, bottomRightCorner3D));
		lineDiv = new line(To2D(lineDiv3D.start), To2D(lineDiv3D.end));
		
		n++;
	}		
	
	var outputTopLeftCorner = clonePoint3D(topLeftCorner3D);
	
	/////////////////////////////////////////////////////////////////
	
	TL = gridTopLeft();
	TR = gridTopRight();
	BL = gridBottomLeft();
	BR = gridBottomRight();

	if (gridIsXZ)
	{
		swapYZ(TL);
		swapYZ(TR);
		swapYZ(BR);
		swapYZ(BL);
	}
	else if (gridIsZY)
	{
		swapXZ(TL);
		swapXZ(TR);
		swapXZ(BR);
		swapXZ(BL);
	}

	topLeftCorner = To2D(TL);
	topRightCorner = To2D(TR);
	bottomLeftCorner = To2D(BL);
	bottomRightCorner = To2D(BR);

	topLeftCorner3D = TL;
	topRightCorner3D = TR;
	bottomLeftCorner3D = BL;
	bottomRightCorner3D = BR;
	
	leftLine = new line(clonePoint(bottomLeftCorner), clonePoint(topLeftCorner));
	rightLine = new line(clonePoint(bottomRightCorner), clonePoint(topRightCorner));

	leftLine3D = new line(clonePoint(bottomLeftCorner3D), clonePoint(topLeftCorner3D));
	rightLine3D = new line(clonePoint(bottomRightCorner3D), clonePoint(topRightCorner3D));
		
	lineDiv23D = new line(midPoint3D(bottomLeftCorner3D, bottomRightCorner3D), midPoint3D(topLeftCorner3D, topRightCorner3D));
	lineDiv2 = new line(To2D(lineDiv23D.start), To2D(lineDiv23D.end));
	
	n = 0;

	while (n < limit)
	{		
		if (betweenVertical(x, y, leftLine, lineDiv2)
			|| between(x, y, leftLine, lineDiv2))
		{
			rightLine3D = cloneLine3D(lineDiv23D);
			
			bottomRightCorner3D = clonePoint3D(rightLine3D.start);
			topRightCorner3D = clonePoint3D(rightLine3D.end);			

			bottomRightCorner = To2D(bottomRightCorner3D);
			topRightCorner = To2D(topRightCorner3D);
			
			rightLine = new line(bottomRightCorner, topRightCorner);
		}
		else
		{
			leftLine3D = cloneLine3D(lineDiv23D);
			
			bottomLeftCorner3D = clonePoint3D(leftLine3D.start);
			topLeftCorner3D = clonePoint3D(leftLine3D.end);

			bottomLeftCorner = To2D(bottomLeftCorner3D);	
			topLeftCorner = To2D(topLeftCorner3D);		
			
			leftLine = new line(bottomLeftCorner, topLeftCorner);
		}
		
		if (distance(leftLine.start, rightLine.start) < 3)
		{
			break;
		}
				
		lineDiv23D = new line(midPoint3D(bottomLeftCorner3D, bottomRightCorner3D), midPoint3D(topLeftCorner3D, topRightCorner3D));
		lineDiv2 = new line(To2D(lineDiv23D.start), To2D(lineDiv23D.end));
		
		n++;
	}		
	
	var outputTopLeftCorner2 = clonePoint3D(topLeftCorner3D);
	
	var p = new Point3D(outputTopLeftCorner2.x, outputTopLeftCorner.y, 0);
		
	if (gridIsXZ)
	{
		p = new Point3D(outputTopLeftCorner2.x, 0, outputTopLeftCorner.z);
	}
	else if (gridIsZY)
	{
		p = new Point3D(0, outputTopLeftCorner.y, outputTopLeftCorner2.z);
	}
		
	return p;
}

function distance(p1, p2)
{
	var d = (p1.x - p2.x) * (p1.x - p2.x);
	d += (p1.y - p2.y) * (p1.y - p2.y);
	return Math.sqrt(d);
}

function distance3(p1, p2)
{
	var d = (p1.x - p2.x) * (p1.x - p2.x);
	d += (p1.y - p2.y) * (p1.y - p2.y);
	d += (p1.z - p2.z) * (p1.z - p2.z);
	return Math.sqrt(d);
}

function length3(line)
{
	return distance3(line.end, line.start);
}

function midPoint(p1, p2)
{
	return new Point(Math.round(p1.x + ((p2.x - p1.x) / 2)), Math.round(p1.y + ((p2.y - p1.y) / 2)));
}

function midPoint3D(p1, p2)
{
	return roundPoint(
		new Point3D(
			p1.x + ((p2.x - p1.x) / 2.0), 
			p1.y + ((p2.y - p1.y) / 2.0), 
			p1.z + ((p2.z - p1.z) / 2.0)
			)
		);
}

function midPoint3DUnround(p1, p2)
{
	return new Point3D(
		p1.x + ((p2.x - p1.x) / 2.0), 
		p1.y + ((p2.y - p1.y) / 2.0), 
		p1.z + ((p2.z - p1.z) / 2.0)
		);
}

function tryHitDetectFacet(mouse)
{
	for (var i = allFacets.length - 1; i >= 0; i--)
	{
		if (hitDetectFacet(mouse, allFacets[i]))
		{
			return allFacets[i]
		}
	}
	
	return -1;
}

function tryHitDetectEdge(mouse)
{
	for (var f = allFacets.length - 1; f >= 0; f--)
	{
		var lines = getFacetLines(allFacets[f]);
		for (var i = 0; i < lines.length; i++)
		{
			if (hitDetectEdge(lines[i].start, lines[i].end, mouse))
			{
				return lines[i];				
			}
		}	
	}
	
	return -1;
}

function tryHitDetectVertex(mouse)
{
	for (var f = allFacets.length - 1; f >= 0; f--)
	{
		var lines = getFacetLines(allFacets[f]);
		
		for (var i = 0; i < lines.length; i++)
		{
			if (hitDetectVertex(lines[i].start, mouse))
			{
				hitVertexEdge = lines[i];
				return lines[i].start;				
			}
			if (hitDetectVertex(lines[i].end, mouse))
			{
				hitVertexEdge = lines[i];
				return lines[i].end;				
			}
		}
	}	
	
	hitVertexEdge = -1;
	return -1;
}

function hitDetectEdge(p13D, p23D, mouse)
{
	var limit = 5;
	
	var m = new Point(mouse.x, mouse.y);
	
	var P1 = new Point(mouse.x + limit, mouse.y);
	var P2 = new Point(mouse.x - limit, mouse.y);
	var P3 = new Point(mouse.x, mouse.y + limit);
	var P4 = new Point(mouse.x, mouse.y - limit);

	var edge = new line(To2D(p13D), To2D(p23D));
	
	if (crosses(edge, new line(m, P1)))
	{
		return true;
	}
	if (crosses(edge, new line(m, P2)))
	{
		return true;
	}
	if (crosses(edge, new line(m, P3)))
	{
		return true;
	}
	if (crosses(edge, new line(m, P4)))
	{
		return true;
	}

	return false;
}

function RotateXYZ(p, rotation_point, radiansX, radiansY, radiansZ)
{
	if (radiansZ != 0.0) // rotate about Z axis
	{
		radiansZ = normalize_radians(radiansZ);

		if (radiansZ != 0)
		{
			var ydiff = (p.y) - (rotation_point.y);
			var xdiff = (p.x) - (rotation_point.x);

			var xd = (xdiff * Math.cos(radiansZ)) - (ydiff * Math.sin(radiansZ));
			xd = Math.round(xd, 0);

			var yd = (xdiff * Math.sin(radiansZ)) + (ydiff * Math.cos(radiansZ));
			yd = Math.round(yd, 0);

			p.x = rotation_point.x + (xd);
			p.y = rotation_point.y + (yd);
		}
	}
	
	if (radiansY != 0.0) // rotate about the Y axis
	{
		radiansY = normalize_radians(radiansY);

		if (radiansY != 0)
		{
			var zdiff = (p.z) - (rotation_point.z);
			var xdiff = (p.x) - (rotation_point.x);

			var xd = (xdiff * Math.cos(radiansY)) - (zdiff * Math.sin(radiansY));
			xd = Math.round(xd, 0);

			var zd = (xdiff * Math.sin(radiansY)) + (zdiff * Math.cos(radiansY));
			zd = Math.round(zd, 0);

			p.x = rotation_point.x + (xd);
			p.z = rotation_point.z + (zd);
		}
	}
	
	if (radiansX != 0.0) // rotate about the X axis
	{
		radiansX = normalize_radians(radiansX);

		if (radiansX != 0)
		{
			var ydiff = (p.y) - (rotation_point.y);
			var zdiff = (p.z) - (rotation_point.z);

			var zd = (zdiff * Math.cos(radiansX)) - (ydiff * Math.sin(radiansX));
			zd = Math.round(zd, 0);

		var yd = (zdiff * Math.sin(radiansX)) + (ydiff * Math.cos(radiansX));
			yd = Math.round(yd, 0);

			p.z = rotation_point.z + (zd);
			p.y = rotation_point.y + (yd);
		}
	}	
}

function rotateX(p, rotation_point, degreesX)
{
	var radiansX = radians_from_degrees(degreesX);
	
	if (radiansX != 0.0) // rotate about the X axis
	{
		radiansX = normalize_radians(radiansX);

		if (radiansX != 0.0)
		{
			var ydiff = (p.z) - (rotation_point.z);
			var zdiff = (p.y) - (rotation_point.y);

			var zd = (zdiff * Math.cos(radiansX)) - (ydiff * Math.sin(radiansX));
			var yd = (zdiff * Math.sin(radiansX)) + (ydiff * Math.cos(radiansX));

			p.y = rotation_point.y + (zd);
			p.z = rotation_point.z + (yd);			
		}
	}	
}

function rotateY(p, rotation_point, degreesY)
{
	var radiansY = radians_from_degrees(degreesY);

	if (radiansY != 0.0) // rotate about the Y axis
	{
		radiansY = normalize_radians(radiansY);

		if (radiansY != 0.0)
		{
			var zdiff = (p.x) - (rotation_point.x); // rise
			var xdiff = (p.z) - (rotation_point.z); // run

			var xd = (xdiff * Math.cos(radiansY)) - (zdiff * Math.sin(radiansY));
			var zd = (xdiff * Math.sin(radiansY)) + (zdiff * Math.cos(radiansY));

			p.z = rotation_point.z + (xd);
			p.x = rotation_point.x + (zd);
		}
	}	
}

function rotateZ(p, rotation_point, degreesZ)
{
	var radiansZ = radians_from_degrees(degreesZ);	

	if (radiansZ != 0.0) // rotate about Z axis
	{
		radiansZ = normalize_radians(radiansZ);
		var g = degrees_from_radians(radiansZ);

		if (radiansZ != 0.0)
		{
			var ydiff = (p.y) - (rotation_point.y); // rise
			var xdiff = (p.x) - (rotation_point.x); // run

			var xd = (xdiff * Math.cos(radiansZ)) - (ydiff * Math.sin(radiansZ));
			var yd = (xdiff * Math.sin(radiansZ)) + (ydiff * Math.cos(radiansZ));

			p.x = rotation_point.x + (xd);
			p.y = rotation_point.y + (yd);
		}
	}
}

function vectorAngle(vector1, vector2)
{
	var angle = 0.0;

	var length1 = Math.sqrt((vector1.x * vector1.x) + (vector1.y * vector1.y) + (vector1.z * vector1.z));

	var length2 = Math.sqrt((vector2.x * vector2.x) + (vector2.y * vector2.y) +	(vector2.z * vector2.z));

	var dot_product = (vector1.x * vector2.x + vector1.y * vector2.y + vector1.z * vector2.z);

	var cosine_of_angle = dot_product / (length1 * length2);

	angle = Math.acos(cosine_of_angle);

	return angle;
}               


function angleDiff(a, b)
{
	return degrees_from_radians(Number(radians_from_degrees(a) + FourPi) - Number(radians_from_degrees(b) + FourPi));
}

function getOrthoOfAxis(axis)
{
	var orientation = getVectorOrientation(axis);

	var origin = new Point3D(0, 0, 0);

	var a = cloneLine3D(axis);
	
	var ortho;
	
	// translate to origin
	a.end.x -= a.start.x;
	a.end.y -= a.start.y;
	a.end.z -= a.start.z;
	
	if (orientation == "z")
	{		
		ortho = new line(origin, new Point3D(0, 0, cubeSize));
		var xAngleAxis = DegreesFromRotationPoint3D("x", ortho.end, origin);
		var yAngleAxis = DegreesFromRotationPoint3D("y", ortho.end, origin);	
		
		var xAngle = DegreesFromRotationPoint3D("x", a.end, origin);
		var x = angleDiff(xAngleAxis, xAngle);
		rotateX(a.end, origin, x);
		
		var yAngle = DegreesFromRotationPoint3D("y", a.end, origin);	
		var y = angleDiff(yAngleAxis, yAngle);		
		rotateY(a.end, origin, y);
	}
	else if (orientation == "x")
	{		
		ortho = new line(origin, new Point3D(cubeSize, 0, 0));
		var yAngleAxis = DegreesFromRotationPoint3D("y", ortho.end, origin);
		var zAngleAxis = DegreesFromRotationPoint3D("z", ortho.end, origin);	
				
		var yAngle = DegreesFromRotationPoint3D("y", a.end, origin);
		var y = angleDiff(yAngleAxis, yAngle);
		rotateY(a.end, origin, y);

		var zAngle = DegreesFromRotationPoint3D("z", a.end, origin);
		var z = angleDiff(zAngleAxis, zAngle);
		rotateZ(a.end, origin, z);
	}
	else
	{		
		ortho = new line(origin, new Point3D(0, cubeSize, 0));
		var xAngleAxis = DegreesFromRotationPoint3D("x", ortho.end, origin);
		var zAngleAxis = DegreesFromRotationPoint3D("z", ortho.end, origin);	
		
		var xAngle = DegreesFromRotationPoint3D("x", a.end, origin);
		var x = angleDiff(xAngleAxis, xAngle);
		rotateX(a.end, origin, x);
		
		var zAngle = DegreesFromRotationPoint3D("z", a.end, origin);	
		var z = angleDiff(zAngleAxis, zAngle);
		rotateZ(a.end, origin, z);
	}

	ortho.start.x += a.start.x;
	ortho.start.y += a.start.y;
	ortho.start.z += a.start.z;
	ortho.end.x += a.start.x;
	ortho.end.y += a.start.y;
	ortho.end.z += a.start.z;
	
	// translate back
	a.end.x += a.start.x;
	a.end.y += a.start.y;
	a.end.z += a.start.z;
	return a;
}


function rotateAroundAxis(orientation, p, axis, radians)
{
	var origin = new Point3D(0, 0, 0);

	var a = cloneLine3D(axis);
	
	// translate to origin
	a.end.x -= a.start.x;
	a.end.y -= a.start.y;
	a.end.z -= a.start.z;
	
	p.x -= a.start.x;
	p.y -= a.start.y;
	p.z -= a.start.z;

	if (orientation == "z")
	{		
		var ortho = new line(origin, new Point3D(0, 0, cubeSize));
		var xAngleAxis = DegreesFromRotationPoint3D("x", ortho.end, origin);
		var yAngleAxis = DegreesFromRotationPoint3D("y", ortho.end, origin);	
		
		var xAngle = DegreesFromRotationPoint3D("x", a.end, origin);
		var x = angleDiff(xAngleAxis, xAngle);
		rotateX(p, origin, x);
		rotateX(a.end, origin, x);
		
		var yAngle = DegreesFromRotationPoint3D("y", a.end, origin);	
		var y = angleDiff(yAngleAxis, yAngle);		
		rotateY(p, origin, y);
		
		rotateZ(p, origin, degrees_from_radians(radians));
		
		rotateY(p, origin, -y);
		rotateX(p, origin, -x);
	}
	else if (orientation == "x")
	{		
		var ortho = new line(origin, new Point3D(cubeSize, 0, 0));
		var yAngleAxis = DegreesFromRotationPoint3D("y", ortho.end, origin);
		var zAngleAxis = DegreesFromRotationPoint3D("z", ortho.end, origin);	
		
		var zAngle = DegreesFromRotationPoint3D("z", a.end, origin);
		var z = angleDiff(zAngleAxis, zAngle);
		rotateZ(p, origin, z);
		rotateZ(a.end, origin, z);
		
		var yAngle = DegreesFromRotationPoint3D("y", a.end, origin);		
		var y = angleDiff(yAngleAxis, yAngle);	
		rotateY(p, origin, y);
		
		rotateX(p, origin, degrees_from_radians(radians));
		
		rotateY(p, origin, -y);
		rotateZ(p, origin, -z);
	}
	else
	{		
		var ortho = new line(origin, new Point3D(0, cubeSize, 0));
		var xAngleAxis = DegreesFromRotationPoint3D("x", ortho.end, origin);
		var zAngleAxis = DegreesFromRotationPoint3D("z", ortho.end, origin);	
		
		var xAngle = DegreesFromRotationPoint3D("x", a.end, origin);
		var x = angleDiff(xAngleAxis, xAngle);
		rotateX(p, origin, x);
		rotateX(a.end, origin, x);
		
		var zAngle = DegreesFromRotationPoint3D("z", a.end, origin)		
		var z = angleDiff(zAngleAxis, zAngle);		
		rotateZ(p, origin, z);
		
		rotateY(p, origin, degrees_from_radians(radians));
		
		rotateZ(p, origin, -z);
		rotateX(p, origin, -x);
	}

	// translate back
	p.x += a.start.x;
	p.y += a.start.y;
	p.z += a.start.z;
	
	roundPoint(p);
}


function normalize_radians(radians)
{
	while (radians >= TwoPi)
	{
		radians -= TwoPi;
	}
	
	while (radians < 0)
	{
		radians += TwoPi;
	}  
	
	return radians;
}

function normalize_degrees(degrees)
{
	while (degrees >= 360)
	{
		degrees -= 360;
	}
	
	while (degrees < 0)
	{
		degrees += 360;
	}  
	
	return degrees;
}

function radians_from_degrees(degrees)
{
	return (Number(degrees) * TwoPi) / 360;
}

function degrees_from_radians(radians)
{
	return (Number(radians) * 360) / TwoPi;
}

function To2D(p3d) // gives a 3D->2D perspective projection
{
	var point3d = new Point3D(p3d.x, p3d.y, p3d.z);
	
	RotateXYZ(point3d, myCenter, radiansX, radiansY, radiansZ);

	var xRise = point3d.x - myCenter.x;
	var yRise = point3d.y - myCenter.y;

	var zRunEye = zEyePlane - point3d.z;
	var zRunView = zViewingPlane - point3d.z;

	var factor = (zRunEye - zRunView) / zRunEye;

	var x = (myCenter.x + (factor * xRise));
	var y = (myCenter.y + (factor * yRise));

	x *= ctx.canvas.width;
	x /= docSize;
	y *= ctx.canvas.width;
	y /= docSize;
	
	var p = new Point(Math.floor(x), -Math.floor(y)); 
	// have to flip sign of Y coordinate, this makes it match the GL side
	
	p.x -= origin.x;
	p.y -= origin.y;
	
	return p;
}

function ToRotated(p3d)
{
	var point3d = new Point3D(p3d.x, p3d.y, p3d.z);
	
	RotateXYZ(point3d, myCenter, radiansX, radiansY, radiansZ);

	return point3d;
}

function timerEvent()
{
	if (tumble)
	{
		degreesX += 0.3;
		degreesY += 0.7;
		degreesZ += 0.2;

		radiansX = radians_from_degrees(degreesX);
		radiansY = radians_from_degrees(degreesY);
		radiansZ = radians_from_degrees(degreesZ);

		cubeRotationY = Math.round(degreesY);
		cubeRotationX = Math.round(degreesX);
		cubeRotationZ = Math.round(degreesZ);
			
	}
	
	if (tumble || isSmear)
	{
		if (is2dWindow || !isGL)
		{
			sortFacets();
			draw();		
		}
		else if (isGL)
		{
			drawSceneGL();
		}
	}
}

function doTumble()
{
	tumble = !tumble;
	
	if (!tumble)
	{
		stopTumble();
	}
}

function Color(r, g, b)
{
	this.R = r;
	this.G = g;
	this.B = b;
}

function color2FromColor(c)
{
	return new Color(c.R / 255.0, c.G / 255.0, c.B / 255.0);	
}

function line(p1, p2)
{
	this.start = p1;
	this.end = p2;
	
	this.edgePoint = new Point3D(0, 0, 0);
	
	this.adjacentFacet = -1;
	this.parentFacet = -1;
}

function clonePoint(p)
{
	return new Point(p.x, p.y);
}

function clonePoint3D(p)
{
	return new Point3D(p.x, p.y, p.z);
}

function lineSegment(p1, p2, div)
{
	var l = new line(clonePoint(p1), clonePoint(p2));
	var p3 = new Point(p1.x + ((p2.x - p1.x) * div), p1.y + ((p2.y - p1.y) * div));
	l.end = p3;
	return l;
}

function RGB(R, G, B)
{
	this.r = R;
	this.g = G;
	this.b = B;
}

function HSL(H, S, L)
{
	this.h = H;
	this.s = S;
	this.l = L;
}

function formsControl(type, text, id, val, xPosition, yPosition, width, choices)
{
	this.type = type;
	this.text = text;
	this.id = id;
	this.val = val;
	this.xPosition = xPosition;
	this.yPosition = yPosition;
	this.width = width;
	this.choices = choices;
}

function cube(left, right, top, bottom, front, back)
{
	if (left == undefined)
	{
		left = 0;
	}
	if (right == undefined)
	{
		right = 0;
	}
	if (top == undefined)
	{
		top = 0;
	}
	if (bottom == undefined)
	{
		bottom = 0;
	}
	if (front == undefined)
	{
		front = 0;
	}
	if (back == undefined)
	{
		back = 0;
	}
	
	this.color = new Color(190, 180, 190); // default solid color
	this.outlineColor = new Color(0, 0, 0); // default solid outline color
	this.textureName = "";
	
	this.nSubdivide = 0;
	
	this.left = left;
	this.right = right;
	this.top = top;
	this.bottom = bottom;
	this.front = front;
	this.back = back;

	this.previousFacetLists = [];
	this.facets = [];
	
    var lefttopback = new Point3D(left, top, back);
	var lefttopfront = new Point3D(left, top, front);
	var righttopfront = new Point3D(right, top, front);
	var righttopback = new Point3D(right, top, back);
	
	var leftbottomback = new Point3D(left, bottom, back);
	var leftbottomfront = new Point3D(left, bottom, front);
	var rightbottomfront = new Point3D(right, bottom, front);
	var rightbottomback = new Point3D(right, bottom, back);
	
	var topPoints = [];
	
	topPoints.push(clonePoint3D(lefttopback));
	topPoints.push(clonePoint3D(righttopback));
	topPoints.push(clonePoint3D(righttopfront));
	topPoints.push(clonePoint3D(lefttopfront));
	topPoints.reverse();
	
	var bottomPoints = [];
	
	bottomPoints.push(clonePoint3D(leftbottomfront));
	bottomPoints.push(clonePoint3D(rightbottomfront));
	bottomPoints.push(clonePoint3D(rightbottomback));
	bottomPoints.push(clonePoint3D(leftbottomback));
	bottomPoints.reverse();
	
	var frontPoints = [];
	
	frontPoints.push(clonePoint3D(lefttopfront));
	frontPoints.push(clonePoint3D(righttopfront));
	frontPoints.push(clonePoint3D(rightbottomfront));
	frontPoints.push(clonePoint3D(leftbottomfront));
	frontPoints.reverse();

	var backPoints = [];
	
	backPoints.push(clonePoint3D(righttopback));
	backPoints.push(clonePoint3D(lefttopback));
	backPoints.push(clonePoint3D(leftbottomback));
	backPoints.push(clonePoint3D(rightbottomback));
	backPoints.reverse();
	
	var leftPoints = [];
	
	leftPoints.push(clonePoint3D(lefttopback));
	leftPoints.push(clonePoint3D(lefttopfront));
	leftPoints.push(clonePoint3D(leftbottomfront));
	leftPoints.push(clonePoint3D(leftbottomback));
	leftPoints.reverse();

	var rightPoints = [];
	
	rightPoints.push(clonePoint3D(righttopfront));
	rightPoints.push(clonePoint3D(righttopback));
	rightPoints.push(clonePoint3D(rightbottomback));
	rightPoints.push(clonePoint3D(rightbottomfront));
	rightPoints.reverse();
	
	var id = 1;
	
	var s1 = new Facet();
	s1.ID = id++;
	s1.points = topPoints;	
	this.facets.push(s1);
	
	var s2 = new Facet();
	s2.ID = id++;
	s2.points = bottomPoints;	
	this.facets.push(s2);
	
	var s3 = new Facet();
	s3.ID = id++;
	s3.points = backPoints;	
	this.facets.push(s3);
	
	var s4 = new Facet();
	s4.ID = id++;
	s4.points = frontPoints;	
	this.facets.push(s4);
	
	var s5 = new Facet();
	s5.ID = id++;
	s5.points = leftPoints;	
	this.facets.push(s5);
	
	var s6 = new Facet();
	s6.ID = id++;
	s6.points = rightPoints;	
	this.facets.push(s6);	
	
	for (var n = 0; n < this.facets.length; n++)
	{
		this.facets[n].cube = this;
	}
}

function makeCube()
{
	var myCube = new cube(myCenter.x - cubeSize, myCenter.x + cubeSize, 
						  myCenter.y - cubeSize, myCenter.y + cubeSize, 
						  myCenter.z - cubeSize, myCenter.z + cubeSize);

	for (var i = 0; i < myCube.facets.length; i++)
	{
		myCube.facets[i].normal = CalculateNormal(myCube.facets[i]);	
	}				

	cubes.push(myCube);

	return myCube;	
}

function addCube()
{
	alertUser("");
	
	makeCube();
	
	updateModel();
	
	draw();
}

function startModel()
{
	alertUser("");
	
	filename = "";
	
	setInterval(timerEvent, 10);

	makeCube();
					 
	canvas = document.createElement('canvas');
	canvas2 = document.createElement('canvas');

	document.body.appendChild(canvas);
	document.body.appendChild(canvas2);

	canvas.style.position = 'fixed';
	canvas2.style.position = 'fixed';

	ctx = canvas.getContext('2d');
	gl = canvas2.getContext("webgl") || canvas2.getContext("experimental-webgl");
	
	pos = new Point(0, 0); // last known position
		
	lastClickPos = new Point(0, 0); // last click position

	window.addEventListener('resize', resize);
	window.addEventListener('keydown', keyDown);
	window.addEventListener('keyup', keyRelease);
	
	canvas.addEventListener('mousemove', mouseMove);
	canvas.addEventListener('mousedown', mouseDown);
	canvas.addEventListener('mouseup', mouseUp);
	canvas.addEventListener('mouseenter', setPosition);
	canvas.addEventListener('click', click);

	
	canvas2.addEventListener('mousemove', mouseMoveGL);
	canvas2.addEventListener('mousedown', mouseDownGL);
	canvas2.addEventListener('mouseup', mouseUpGL);

	
	
	canvas.style.backgroundColor = colorString(canvasBackgroundColor, false);

	canvas.style.position = "absolute";

	canvas.style.border = '1px solid black';	
	
	canvas2.style.position = "absolute";

	canvas2.style.border = '1px solid black';	
	resize();
	
	document.getElementById("checkboxoutlines").checked = false;
	document.getElementById("checkboxsolid").checked = true;
	document.getElementById("checkboxgrid").checked = false;
	document.getElementById("toolslider").checked = true;
	document.getElementById("checkboxtwosided").checked = true;
	document.getElementById("checkboxwebgl").checked = false;
	document.getElementById("checkbox2DWindow").checked = true;
	document.getElementById("checkboxtransparent").checked = false;
	
	if (gl != null)
	{	
	  gl.clearColor(canvasBackgroundColor.R / 255.0, canvasBackgroundColor.G / 255.0, canvasBackgroundColor.B / 255.0, 1.0);
	  gl.enable(gl.DEPTH_TEST);
	  gl.depthFunc(gl.LEQUAL);
	  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}
	
	addShaderToList("Phong");
	addShaderToList("Rainbow 1");
	addShaderToList("Rainbow 2");
	addShaderToList("Stripes");
	addShaderToList("Chrome");
	addShaderToList("Smear");
	addShaderToList("Flat");
	addShaderToList("T-Map");
	addShaderToList("Comic");
	addShaderToList("Comic 2");
	addShaderToList("Topo");
	addShaderToList("Paint By Numbers");
	
	var rect = canvas.getBoundingClientRect();
	origin = new Point(-(rect.width / 2), -(rect.height / 2));
	
	setEditViewOptions();
	
	hideInputForm();
}

function setPosition(e) // new position from mouse event
{
	if (e != null)
	{
		var rect = canvas.getBoundingClientRect();

		pos.x = Math.round(e.clientX - rect.left);
		pos.y = Math.round(e.clientY - rect.top);
	}
}

function setPreviousPosition(e) 
{
	if (e != null)
	{
		var rect = canvas.getBoundingClientRect();

		previousPos.x = Math.round(e.clientX - rect.left);
		previousPos.y = Math.round(e.clientY - rect.top);
	}
}

function setPositionGL(e) // new position from mouse event
{
	if (e != null)
	{
		var rect = canvas2.getBoundingClientRect();

		posGL.x = Math.round(e.clientX - rect.left);
		posGL.y = Math.round(e.clientY - rect.top);
	}
}

function setPreviousPositionGL(e) 
{
	if (e != null)
	{
		var rect = canvas2.getBoundingClientRect();

		previousPosGL.x = Math.round(e.clientX - rect.left);
		previousPosGL.y = Math.round(e.clientY - rect.top);
	}
}

function pointFromMouse(e)
{
	if (e == null)
	{
		return new Point(0, 0);
	}
	
	var rect = canvas.getBoundingClientRect();

	return new Point(e.clientX - rect.left, e.clientY - rect.top);
}

function doubleClick(e)
{
	setPosition(e);

	draw();
}

function setCanvasFocus()
{
	canvas.focus();
}

function isChosen(name)
{
	if (document.getElementById(name).checked) 
	{
		return true;
	}	
	
	return false;
}

function fillChosen()
{
	return isChosen("checkboxfill");
}

function solidChosen()
{
	return isChosen("checkboxsolid");
}

function normalsChosen()
{
	return isChosen("checkboxnormals");
}

function twoSidedChosen()
{
	return isChosen("checkboxtwosided");
}

function outlinesChosen()
{
	return isChosen("checkboxoutlines");
}

function gridChosen()
{
	return isChosen("checkboxgrid");
}

function toolChosen()
{
	if (document.getElementById("toolslider").checked) 
	{
		return "slider";
	}	
	else if (document.getElementById("toolsolid").checked) 
	{
		return "solid";
	}	
	else if (document.getElementById("toolfacet").checked) 
	{
		return "facet";
	}	
	else if (document.getElementById("tooledge").checked) 
	{
		return "edge";
	}	
	else if (document.getElementById("toolvertex").checked) 
	{
		return "vertex";
	}	
	else if (document.getElementById("tooldraw").checked) 
	{
		return "draw";
	}	
	
	return "";
}

function stopTumble()
{
	tumble = false;
	degreesX = 0;
	degreesY = 0;
	degreesZ = 0;
	radiansX = radians_from_degrees(degreesX);
	radiansY = radians_from_degrees(degreesY);
	radiansZ = radians_from_degrees(degreesZ);
	cubeRotationY = 0.0;
	cubeRotationX = 0.0;
	cubeRotationZ = 0.0;

	sortFacets();
	
	draw();
}

function click(e)
{
	if (isSubdividing)
	{
		return;
	}	

	if (menuIsDisplayed)
	{
		return;
	}

	if (tumble)
	{
		stopTumble();
	}

	clickTime = Date.now();
	
	var elapsedTime = clickTime - lastClickTime;
	
	if (elapsedTime < 200)
	{
		doubleClick();
		return;
	}
	
	lastClickTime = clickTime;

	setPosition(e);

	if (toolChosen() == "draw")
	{
	}
	if (toolChosen() == "vertex")
	{
		if (hitVertex == -1)
		{
			selectedVertexes = [];
		}
		else
		{
			if (!listHas(selectedVertexes, hitVertex))
			{
				selectedVertexes.push(hitVertex);
			}
		}
	}
	if (toolChosen() == "edge")
	{
		if (hitLine == -1)
		{
			selectedLines = [];
		}
		else
		{
			if (!listHas(selectedLines, hitLine))
			{
				selectedLines.push(hitLine);
			}
		}
	}
	
	lastClickPos = pointFromMouse(e);
	
	draw();
}

function setFacetCount(solid)
{
	informUser(solid == -1 ? "" : solid.facets.length + " facets");
}

function resize() 
{
	var leftBorder = 130;
	var topBorder = 64;
	var bottomBorder = 10;
	var middleBorder = 10;
	
	if (isGL && is2dWindow)
	{
		var width = (window.innerWidth - (leftBorder + rightBorder + middleBorder)) / 2;
		ctx.canvas.width = width;
		var height = window.innerHeight - (topBorder + bottomBorder);
		ctx.canvas.height = height;
		
		ctx.canvas.style.left = leftBorder + "px";
		ctx.canvas.style.top = topBorder + "px";

		canvas2.width = width;
		canvas2.height = height;
		
		canvas2.style.left = leftBorder + width + middleBorder + "px";		
		canvas2.style.top = topBorder + "px";
		
		gl.viewport(0, 0, canvas2.width, canvas2.height);
	}
	else if (isGL && !is2dWindow)
	{
		canvas2.width = window.innerWidth - (leftBorder + rightBorder);
		canvas2.height = window.innerHeight - (topBorder + bottomBorder);
		
		canvas2.style.left = leftBorder + "px";
		canvas2.style.top = topBorder + "px";

		ctx.canvas.width = rightBorder;
		ctx.canvas.height = rightBorder;
		
		ctx.canvas.style.left = leftBorder + "px";
		ctx.canvas.style.top = topBorder + ctx.canvas.height + rightBorder + "px";
		
		gl.viewport(0, 0, canvas2.width, canvas2.height);
	}
	else
	{
		ctx.canvas.width = window.innerWidth - (leftBorder + rightBorder);
		ctx.canvas.height = window.innerHeight - (topBorder + bottomBorder);
		
		ctx.canvas.style.left = leftBorder + "px";
		ctx.canvas.style.top = topBorder + "px";

		canvas2.width = rightBorder;
		canvas2.height = rightBorder;
		
		canvas2.style.left = leftBorder + "px";
		canvas2.style.top = topBorder + canvas.height + rightBorder + "px";
	}
		
		
	draw();
}

function hideCanvas() 
{
	var leftBorder = 130;
	var topBorder = 64;
	var bottomBorder = 10;
	
	ctx.canvas.width = 100;
	ctx.canvas.height = 70;


	var rightBorder = 30;
	var middleBorder = 10;

	
	var width = (window.innerWidth - (leftBorder + rightBorder));
	docSize = (defaultDocSize * width) / 1000;
	
	canvas2.width = 100;
	canvas2.height = 70;

	var rect = canvas.getBoundingClientRect();
	origin = new Point(-(rect.width / 2), -(rect.height / 2));
	
	if (is2dWindow && isGL)
	{
		canvas.style.left = leftBorder + "px";
		canvas.style.top = topBorder + "px";		

		canvas2.style.left = (leftBorder + 100 + middleBorder) + "px";
		canvas2.style.top = topBorder + "px";
	}
	else if (is2dWindow)
	{
		canvas.style.left = leftBorder + "px";
		canvas.style.top = topBorder + "px";
		
		canvas2.style.left = window.innerWidth;
		canvas2.style.top = topBorder + "px";
	}
	else if (isGL)
	{
		canvas2.style.left = leftBorder + "px";
		canvas2.style.top = topBorder + "px";

		canvas.style.left = window.innerWidth;
		canvas.style.top = topBorder + "px";
	}
	
	draw();
}

function rotatePoints(points, clockwise, axis, degrees, CENTER)
{
	var amount = -5;
	if (clockwise == true)
	{
		amount = 5;
	}
	
	if (degrees != undefined)
	{
		amount = degrees;
	}
	
	axis.x *= amount;
	axis.y *= amount;
	axis.z *= amount;
	
	moveVertexes(getVertexCube(points[0]), new Point3D(0, 0, 0), points, axis, undefined, undefined, CENTER);
		
	updateModel();
}

function rotateFacetList(facetList, clockwise, axis, amount, CENTER)
{
	rotatePoints(getFacetListPoints(facetList), clockwise, axis, amount, CENTER);
}

function rotateSelectionAroundNormal(amount)
{
	var points = [];
	
	if (selectedFacets.length > 0)
	{
		cloneModel();
		rotateFacetsAroundNormal(selectedFacets, amount);
	}
	else
	{
		alertUser("Please select facets.");
	}
}

function rotateFacetsAroundNormal(facets, amount)
{
	var cube = facets[0].cube; // must all be on same cube
	for (var i = 0; i < facets.length; i++)
	{
		var points = getFacetListPoints(oneFacetList(facets[i]));
		moveVertexes(cube, null, points, null, amount, facets[i].normal)
	}
	updateModel();
}

function rotateSelectionAroundEdge(amount, index, alternateEdge, corner)
{
	if (selectedFacets.length > 0 && amount != 0.0)
	{
		cloneModel();
		rotateFacetsAroundEdge(selectedFacets, amount, index, alternateEdge, corner);
	}
	else
	{
		alertUser("Please select facets.");
	}
}

function mostVertical(line1, line2)
{
	var newlen = cubeSize;

	var end1 = LengthPoint(line1, newlen);
	var end2 = LengthPoint(line2, newlen);
	
	var a = Math.abs(line1.start.y - end1.y);
	var b = Math.abs(line2.start.y - end2.y);
	
	if (a > b)
	{
		return line1;
	}
	
	return line2;
}

function mostHorizontal(line1, line2)
{
	var newlen = cubeSize;

	var end1 = LengthPoint(line1, newlen);
	var end2 = LengthPoint(line2, newlen);

	var a = Math.abs(line1.start.x - end1.x);
	var b = Math.abs(line2.start.x - end2.x);
	
	var c = Math.abs(line1.start.z - end1.z);
	var d = Math.abs(line2.start.z - end2.z);
	
	a = Math.max(a, c);
	b = Math.max(b, d);
	
	if (a > b)
	{
		return line1;
	}
	
	return line2;
}

function rotateFacetsAroundEdge(facets, amount, edgeIndex, alternateEdge, corner, vertical, horizontal)
{
	var points = [];
	
	if (facets.length > 0 && amount != 0.0)
	{
		var cube = facets[0].cube; // must all be on same cube
		for (var i = 0; i < facets.length; i++)
		{
			var facet = facets[i];
		
			var points = getFacetListPoints(oneFacetList(facet));
			
			var axis = new line(
				midPoint3DUnround(facet.points[0], facet.points[1]), 
				midPoint3DUnround(facet.points[2], facet.points[3])
				);
			if (edgeIndex > -1) // specified an edge
			{
				var otherEdgeIndex = 0;
				if (edgeIndex == 0)
				{
					otherEdgeIndex = 2;
				}
				else if (edgeIndex == 2)
				{
					otherEdgeIndex = 0;
				}
				else if (edgeIndex == 1)
				{
					otherEdgeIndex = 3;
				}
				else if (edgeIndex == 3)
				{
					otherEdgeIndex = 1;
				}
				axis = new line(
						midPoint3DUnround(facet.edges[edgeIndex].start, facet.edges[otherEdgeIndex].end), 
						midPoint3DUnround(facet.edges[otherEdgeIndex].start, facet.edges[edgeIndex].end)
						);
			}
			else if (horizontal == true)
			{
				axis = mostHorizontal(
								new line(
										midPoint3DUnround(facet.points[1], facet.points[2]), 
										midPoint3DUnround(facet.points[3], facet.points[0])
										),
								new line(
										midPoint3DUnround(facet.points[0], facet.points[1]), 
										midPoint3DUnround(facet.points[2], facet.points[3])
										)
									);
			}
			else if (vertical == true)
			{
				axis = mostVertical(
								new line(
										midPoint3DUnround(facet.points[1], facet.points[2]), 
										midPoint3DUnround(facet.points[3], facet.points[0])
										),
								new line(
										midPoint3DUnround(facet.points[0], facet.points[1]), 
										midPoint3DUnround(facet.points[2], facet.points[3])
										)
									);
			}
			else
			{
				if (alternateEdge == true)
				{
					axis = new line(
						midPoint3DUnround(facet.points[1], facet.points[2]), 
						midPoint3DUnround(facet.points[3], facet.points[0])
						);
				}
				
				if (corner == true)
				{
					axis = new line(facet.points[0], facet.points[2]);
					if (alternateEdge == true)
					{
						axis = new line(facet.points[1], facet.points[3]);
					}
				}
			}

			facet.previousAxis = cloneLine3D(axis); // for 2-part bends

			moveVertexes(cube, null, points, null, amount, axis);			
		}
		updateModel();
	}
	
	return edgeIndex;
}

function rotateFacetAroundAxis(axis, facet, amount)
{
	var points = [];
	
	if (amount != 0.0)
	{
		var cube = facet.cube;
		
		var points = getFacetListPoints(oneFacetList(facet));
			
		moveVertexes(cube, null, points, null, amount, axis);			
	}
}

function rotateSelection(clockwise, axis, amount)
{
	var points = [];
	
	if (selectedSolids.length == 1)
	{
		points = getFacetListPoints(selectedSolids[0].facets);
	}
	else if (selectedFacets.length > 0)
	{
		points = getFacetListPoints(selectedFacets);
	}
	else if (selectedLines.length > 0)
	{
		points = getEdgeListPoints(selectedLines);
	}
	else if (selectedVertexes.length > 0)
	{
		points = selectedVertexes;
	}
	
	if (points.length > 0)
	{
		cloneModel();
		rotatePoints(points, clockwise, axis, amount);
	}	
	else
	{
		alertUser("Please select solids, facets, edges, or vertices.");
	}
}

function keyRelease(e) 
{
	if (anyFormIsShown())
	{
		return;
	}

	if (e.charCode == 0 && e.shiftKey == false)
	{
		shiftIsDown = false;
	}
}

function isEditing()
{
	return is2dWindow || !isGL;
}

function showExtrudeSeriesForm()
{
	if (selectedFacets.length == 0)
	{
		alertUser("Please select some facets.");
		return;
	}

	shiftIsDown = false;
	
	var ctls = [];
					
	var columnWidth = 80;
	var spaceWidth = 20;
					
	var left = spaceWidth;
	var left2 = left + columnWidth;
	
	var left3 = left2 + columnWidth + spaceWidth;
	var left4 = left3 + columnWidth;
	
	var left5 = left4 + columnWidth + spaceWidth;
	var left6 = left5 + columnWidth;
	
	var top = 60;
	var spacing = 30;

	var textBoxWidth = 70;
	
	var pickListChoices = [];
	pickListChoices.push("X");
	pickListChoices.push("Y");
	pickListChoices.push("Z");
						
	var pickListChoices2 = [];
	pickListChoices2.push("");
	pickListChoices2.push("X");
	pickListChoices2.push("Y");
	pickListChoices2.push("Z");
	
	ctls.push(new formsControl("label", "Repeat", "labelGeneric0", "", left, top, ""));
	ctls.push(new formsControl("text", "", "repeatExtrudeNumber", "8", left2, top, textBoxWidth));
	
	ctls.push(new formsControl("label", "As Group", "labelGeneric4", "", left3, top, ""));
	ctls.push(new formsControl("checkbox", "As Group", "repeatExtrudeAsGroup", "", left4, top, textBoxWidth));
	
	top += spacing;
	
	ctls.push(new formsControl("label", "Length", "labelGeneric5", "", left, top, ""));
	ctls.push(new formsControl("text", "", "repeatExtrudeLength", cubeSize, left2, top, textBoxWidth));
	
	top += spacing;
	
	ctls.push(new formsControl("label", "Scale", "labelGeneric1", "", left, top, ""));
	ctls.push(new formsControl("text", "", "repeatExtrudeGrow", "0.85", left2, top, textBoxWidth));
	
	top += spacing;
		
	ctls.push(new formsControl("label", "Tilt X", "labelGenericA3", "", left, top, ""));
	ctls.push(new formsControl("text", "", "repeatExtrudeTiltX", "", left2, top, textBoxWidth));
	
	ctls.push(new formsControl("label", "Tilt Y", "labelGenericA4", "", left3, top, ""));
	ctls.push(new formsControl("text", "", "repeatExtrudeTiltY", "", left4, top, textBoxWidth));
	
	ctls.push(new formsControl("label", "Tilt Z", "labelGenericA5", "", left5, top, ""));
	ctls.push(new formsControl("text", "", "repeatExtrudeTiltZ", "", left6, top, textBoxWidth));
	
	top += spacing;
	
	ctls.push(new formsControl("label", "Bend", "labelBend", "", left, top, ""));
	ctls.push(new formsControl("text", "", "repeatExtrudeBend", "", left2, top, textBoxWidth));
	
	ctls.push(new formsControl("label", "Horiz.", "labelGeneric4", "", left3, top, ""));
	ctls.push(new formsControl("checkbox", "Horizontal", "repeatExtrudeBendHorizontal", "", left4, top, textBoxWidth));	
	
	ctls.push(new formsControl("label", "Vert.", "labelGeneric4", "", left5, top, ""));
	ctls.push(new formsControl("checkbox", "Vertical", "repeatExtrudeBendVertical", "", left6, top, textBoxWidth));	
	
	top += spacing;
	
	ctls.push(new formsControl("label", "Twist", "labelGenericTwist", "", left, top, ""));
	ctls.push(new formsControl("text", "", "repeatExtrudeTwist", "", left2, top, textBoxWidth));
	
	top += spacing;
	
	ctls.push(new formsControl("label", "Shift X", "label", "", left, top, ""));
	ctls.push(new formsControl("text", "", "repeatExtrudeShiftX", "", left2, top, textBoxWidth));
	
	ctls.push(new formsControl("label", "Shift Y", "label", "", left3, top, ""));
	ctls.push(new formsControl("text", "", "repeatExtrudeShiftY", "", left4, top, textBoxWidth));
	
	ctls.push(new formsControl("label", "Shift Z", "label", "", left5, top, ""));
	ctls.push(new formsControl("text", "", "repeatExtrudeShiftZ", "", left6, top, textBoxWidth));
	
	showGenericForm("Extrude Series", "Okay", "repeatExtrude", ctls);
	
	document.getElementById("repeatExtrudeNumber").value = nExtrudeSeries;	
	document.getElementById("repeatExtrudeAsGroup").checked = asGroupExtrudeSeries;
	document.getElementById("repeatExtrudeGrow").value = scaleString;
	document.getElementById("repeatExtrudeLength").value = lengthString;
	document.getElementById("repeatExtrudeTiltX").value = tiltStringX;
	document.getElementById("repeatExtrudeTiltY").value = tiltStringY;
	document.getElementById("repeatExtrudeTiltZ").value = tiltStringZ;
	document.getElementById("repeatExtrudeBend").value = bendString;
	document.getElementById("repeatExtrudeBendHorizontal").checked = bendHorizontal;
	document.getElementById("repeatExtrudeBendVertical").checked = bendVertical;
	document.getElementById("repeatExtrudeTwist").value = twistString;
	document.getElementById("repeatExtrudeShiftX").value = shiftXString;
	document.getElementById("repeatExtrudeShiftY").value = shiftYString;
	document.getElementById("repeatExtrudeShiftZ").value = shiftZString;

}

function keyDown(e) 
{
	if (anyFormIsShown())
	{
		return;
	}

	if (isSubdividing)
	{
		return;
	}	

	alertUser("");
	
	var m = 0;
	
	if (e.charCode == 0 && e.shiftKey == true) // shiftbar was pressed
	{
		shiftIsDown = true;
	}
	
	if ((e.char == "e" && !shiftIsDown) || (e.keyCode == 69 && !shiftIsDown))
	{
		if (isEditing())
		{
			setInputValue(cubeSize * 2);
			doExtrudeFacets();
		}
	}
	else if ((e.char == "e" && shiftIsDown) || (e.keyCode == 69 && shiftIsDown))
	{
		if (isEditing())
		{
			showExtrudeSeriesForm();
		}
	}
	else if (e.char == "i" || (e.keyCode == 73 && e.shiftKey == false))
	{
		if (isEditing())
		{
			setInputValue(cubeSize * 2);
			doIndentFacets();
		}
	}
	else if (e.char == "b" || (e.keyCode == 66 && e.shiftKey == false))
	{
		if (isEditing())
		{
			setInputValue(cubeSize * 2);
			bevelSelectedFacets();
		}
	}
	else if (e.char == "g" || (e.keyCode == 71 && e.shiftKey == false))
	{
		if (isEditing())
		{
			setInputValue(cubeSize * 2);
			doExtrudeFacets(true);
		}
	}
	else if (e.char == "p" || (e.keyCode == 80 && e.shiftKey == false))
	{		
		splitEdge();
	}
	else if (e.char == "s" || (e.keyCode == 83 && e.shiftKey == false))
	{		
		subdivide();
		hitSolid = -1;
		selectedSolids = [];
		draw();
	}
	else if (e.char == "u" || (e.keyCode == 85 && e.shiftKey == false))
	{		
		unify();
		hitSolid = -1;
		selectedSolids = [];
		draw();
	}
	if (e.char == ")" || (e.keyCode == 48 && e.shiftKey == true))
	{
		if (isEditing())
		{
			rotateSelection(true, new Point3D(1, 0, 0));
		}
	}
	else if (e.char == "/" || (e.keyCode == 191 && e.shiftKey == false))
	{
		if (isEditing())
		{
			rotateSelectionAroundNormal(5);
		}
	}
	else if (e.char == "\\" || (e.keyCode == 220 && e.shiftKey == false))
	{
		if (isEditing())
		{
			rotateSelectionAroundNormal(-5);
		}
	}
	else if (e.char == "?" || (e.keyCode == 191 && e.shiftKey == true))
	{
		if (isEditing())
		{
			rotateSelectionAroundEdge(5, -1, e.ctrlKey == true, e.altKey == true);
		}
	}
	else if (e.char == "|" || (e.keyCode == 220 && e.shiftKey == true))
	{
		if (isEditing())
		{
			rotateSelectionAroundEdge(-5, -1, e.ctrlKey == true, e.altKey == true);
		}
	}
	else if (e.char == "(" || (e.keyCode == 57 && e.shiftKey == true))
	{
		if (isEditing())
		{
			rotateSelection(false, new Point3D(1, 0, 0));
		}
	}
	else if (e.char == "]" || (e.keyCode == 221 && e.shiftKey == false))
	{
		if (isEditing())
		{
			rotateSelection(true, new Point3D(0, 1, 0));
		}
	}
	else if (e.char == "[" || (e.keyCode == 219 && e.shiftKey == false))
	{
		if (isEditing())
		{
			rotateSelection(false, new Point3D(0, 1, 0));
		}
	}
	else if (e.char == "}" || (e.keyCode == 221 && e.shiftKey == true))
	{
		if (isEditing())
		{	
			rotateSelection(true, new Point3D(0, 0, 1));
		}
	}
	else if (e.char == "{" || (e.keyCode == 219 && e.shiftKey == true))
	{
		if (isEditing())
		{
			rotateSelection(false, new Point3D(0, 0, 1));
		}
	}
	else if (e.char == ">" || (e.keyCode == 190 && e.shiftKey == true))
	{
		if (isEditing())
		{
			if (selectedFacets.length > 0)
			{
				inflateFacets(selectedFacets,  300);
			
				updateCube(selectedFacets[0].cube);					
			}
			else
			{
				alertUser("Please select facets.");
			}
		}
	}
	else if (e.char == "<" || (e.keyCode == 188 && e.shiftKey == true))
	{
		if (isEditing())
		{	
			if (selectedFacets.length > 0)
			{
				inflateFacets(selectedFacets,  -300);
			
				updateCube(selectedFacets[0].cube);			
			}
			else
			{
				alertUser("Please select facets.");
			}
		}
	}
	else if (e.char == "X" || (e.keyCode == 88 && e.shiftKey == true))
	{
		if (e.ctrlKey == true)
		{
			slideSelected(new Point3D(1, 0, 0), keySlideAmount);
		}
		else
		{
			growSelected(new Point3D(1, 0, 0));
		}
	}
	else if (e.char == "x" || (e.keyCode == 88 && e.shiftKey == false))
	{
		if (e.ctrlKey == true)
		{
			slideSelected(new Point3D(1, 0, 0), -keySlideAmount);
		}
		else
		{
			shrinkSelected(new Point3D(1, 0, 0));
		}
	}
	else if (e.char == "a" || (e.keyCode == 65 && e.shiftKey == false))
	{
		shrinkSelected(new Point3D(1, 1, 1));
	}
	else if (e.char == "A" || (e.keyCode == 65 && e.shiftKey == true))
	{
		growSelected(new Point3D(1, 1, 1));
	}
	else if (e.char == "Y" || (e.keyCode == 89 && e.shiftKey == true))
	{
		if (e.ctrlKey == true)
		{
			slideSelected(new Point3D(0, 1, 0), keySlideAmount);
		}
		else
		{
			growSelected(new Point3D(0, 1, 0));
		}
	}
	else if (e.char == "y" || (e.keyCode == 89 && e.shiftKey == false))
	{
		if (e.ctrlKey == true)
		{
			slideSelected(new Point3D(0, 1, 0), -keySlideAmount);
		}
		else
		{
			shrinkSelected(new Point3D(0, 1, 0));
		}
	}
	else if (e.char == "Z" || (e.keyCode == 90 && e.shiftKey == true))
	{
		if (e.ctrlKey == true)
		{
			slideSelected(new Point3D(0, 0, 1), keySlideAmount);
		}
		else
		{
			growSelected(new Point3D(0, 0, 1));
		}
	}
	else if (e.char == "z" || (e.keyCode == 90 && e.shiftKey == false))
	{
		if (e.ctrlKey == true)
		{
			slideSelected(new Point3D(0, 0, 1), -keySlideAmount);
		}
		else
		{
			shrinkSelected(new Point3D(0, 0, 1));
		}
	}
	else if ((e.char == "+") || (e.keyCode == 187 && e.shiftKey == true))
	{
		zoomIn();
	}
	else if ((e.char == "-") || (e.keyCode == 189 && e.shiftKey == false))
	{
		zoomOut();
	}
	else if ((e.char == "=") || (e.keyCode == 187 && e.shiftKey == false))
	{
		zoomNormal(true);
	}
	else if (e.keyCode == 37) // left
	{
		e.preventDefault();
		if (e.ctrlKey == true)
		{
			rotateFromAmountXY(keyRotateAmount, 0.0);
			rotateFromAmountXYGL(keyRotateAmount, 0.0);
		}
		else
		{
			origin.x -= ctx.canvas.width / 20;
			slideGL(30, 0);
		}
		draw();
	}
	else if (e.keyCode == 38) // up
	{
		e.preventDefault();
		if (e.ctrlKey == true)
		{
			rotateFromAmountXY(0.0, keyRotateAmount);
			rotateFromAmountXYGL(0.0, -keyRotateAmount);
		}
		else
		{
			origin.y -= ctx.canvas.width / 20;
			slideGL(0, 30);
		}
		draw();
	}
	else if (e.keyCode == 39) // right
	{
		e.preventDefault();
		if (e.ctrlKey == true)
		{
			rotateFromAmountXY(-keyRotateAmount, 0.0);
			rotateFromAmountXYGL(-keyRotateAmount, 0.0);
		}
		else
		{
			origin.x += ctx.canvas.width / 20;
			slideGL(-30, 0);
		}
		draw();
	}
	else if (e.keyCode == 40) // down
	{
		e.preventDefault();
		if (e.ctrlKey == true)
		{
			rotateFromAmountXY(0.0, -keyRotateAmount);
			rotateFromAmountXYGL(0.0, keyRotateAmount);
		}
		else
		{
			origin.y += ctx.canvas.width / 20;
			slideGL(0, -30);
		}
		draw();
	}
	
	sortFacets();
	
	draw();
}

function get3dMoveAmount()
{
	var pointMouse = planeIntersect3D(pos.x, pos.y);
	var pointMousePrev = planeIntersect3D(previousPos.x, previousPos.y);
	var moveAmount = new Point3D(
	    Math.round(pointMouse.x - pointMousePrev.x), 
		Math.round(pointMouse.y - pointMousePrev.y), 
		Math.round(pointMouse.z - pointMousePrev.z)
		);
	return moveAmount;
}

function handleColorMouse(x, y)
{
	if (x <= 360)
	{
		colorPickHue = x;
		colorPickSaturation = (colorPickHeight - y) / colorPickHeight;
	}
	else if (x < 360 + 50)
	{
		colorPickLuminosity = (colorPickHeight - y) / colorPickHeight;
	}
	
	var rgb = HSLtoRGB(colorPickHue, colorPickSaturation, colorPickLuminosity);
			
	var color = new Color(Math.round(rgb.r), Math.round(rgb.g), Math.round(rgb.b));
	
	if (colorPickMode == "background")
	{
		canvasBackgroundColor = color;
		canvas.style.backgroundColor = colorString(canvasBackgroundColor, false);
	}
	else if (colorPickMode == "line")
	{
		for (var i = 0; i < selectedSolids.length; i++)
		{
			selectedSolids[i].outlineColor = color;
		}
	}
	else
	{
		for (var i = 0; i < selectedSolids.length; i++)
		{
			selectedSolids[i].color = color;
		}
	}
	
	draw();
}

function zoomFromMouse()
{
	var xAmount = (pos.x - previousPos.x) / ctx.canvas.width;
	
	docSize -= xAmount * defaultDocSize;
}

function zoomFromMouseGL()
{
	var xAmount = (posGL.x - previousPosGL.x) / canvas2.width;
	
	zoomAmountGL -= xAmount * zoomSlideIncrementGL;
}

function mouseMove(e)
{
	if (isSubdividing)
	{
		return;
	}
	
	if (anyFormIsShown())
	{
		return;
	}
	
	lineDiv = -1;
	lineDiv2 = -1;

	setPosition(e);

	if (menuIsDisplayed)
	{
		processMenuMouseMove(pos.x, pos.y);
		return;
	}
	
	if (mouseIsDown && colorPickMode.length > 0)
	{
		handleColorMouse(pos.x, pos.y);
		return;
	}
	
	if (mouseIsDown && shiftIsDown && toolChosen() == "slider")
	{
		zoomFromMouse();
		setPreviousPosition(e);
		draw();
		return;
	}
	
	if (mouseIsDown && rightMouseIsDown)
	{
		rotateFromMouse();
	}
	else if (toolChosen() == "slider")
	{
		if (mouseIsDown)
		{
			slideFromMouse();
		}
	}
	else if (toolChosen() == "edge")
	{
		if (mouseIsDown)
		{
			if (hitLine != -1)
			{
				if (!movingEdge)
				{
					movingEdge = true;
					cloneModel();
				}
			
				moveEdges(get3dMoveAmount());
			}
		}
		else
		{
			hitLine = tryHitDetectEdge(pos);
		}
	}
	else if (toolChosen() == "vertex")
	{
		if (mouseIsDown)
		{
			if (hitVertex != -1 && hitVertexEdge != -1)
			{
				if (selectedVertexes.length > 0)
				{
					if (!movingVertex)
					{
						movingVertex = true;
						cloneModel();
					}
					moveVertexes(hitVertexEdge.parentFacet.cube, get3dMoveAmount(), selectedVertexes);
					updateModel();
				}
				else
				{
					var list = [];
					list.push(hitVertex);
					moveVertexes(hitVertexEdge.parentFacet.cube, get3dMoveAmount(), list);
					updateModel();
				}
			}
		}
		else
		{
			hitVertex = tryHitDetectVertex(pos);
		}
	}
	else if (toolChosen() == "facet")
	{
		if (draggingRect)
		{
			selectedFacets = [];
			
			for (var e = 0; e < allFacets.length; e++)
			{
				if (facetIsWithin(mouseDownPos, pos, allFacets[e]))
				{
					selectedFacets.push(allFacets[e]);
				}
			}
		}
		else
		{		
			if (movingFacets && mouseIsDown)
			{
				moveSelectedFacets(get3dMoveAmount());
			}
			else if (mouseIsDown && !movingFacets)
			{
				hitFacet = tryHitDetectFacet(pos);
				if (hitFacet != -1 && !listHas(selectedFacets, hitFacet))
				{
					selectedFacets.push(hitFacet);
				}
			}
			else
			{
				hitFacet = tryHitDetectFacet(pos);
			}
		}
	}
	else if (toolChosen() == "solid")
	{
		if (mouseIsDown)
		{
			if (hitSolid != -1)
			{
				if (!movingSolid)
				{
					movingSolid = true;
					cloneModel();
				}
				moveSolid(hitSolid, get3dMoveAmount());
			}
		}
		else
		{
			hitFacet = tryHitDetectFacet(pos);
			
			if (hitFacet != -1)
			{
				hitSolid = hitFacet.cube;
				setFacetCount(hitSolid);
			}
			else
			{
				hitSolid = -1;
			}
		}
	}
	
	setPreviousPosition(e);	
	
	draw();
}

function mouseMoveGL(e)
{
	if (isSubdividing)
	{
		return;
	}
	
	lineDiv = -1;
	lineDiv2 = -1;

	setPositionGL(e);

	if (mouseIsDown && shiftIsDown)
	{
		zoomFromMouseGL();
		setPreviousPosition(e);
		draw();
	}
	else if (mouseIsDown && rightMouseIsDown)
	{
		rotateFromMouseGL();
		drawSceneGL();
	}
   	else if (mouseIsDown)
	{
		slideFromMouseGL();
		draw();
	}
	
	setPreviousPositionGL(e);	
	
}

function correctFacetDirection(cube)
{
	updateCube(cube);
	
	var list = [];
	
	for (var i = 0; i < cube.facets.length; i++)
	{
		list.push(cube.facets[i]);
	}
	
	var facet = list[0];

	while (list.length > 1)
	{				
		deleteFacetFromList(facet, list);
				
		var nextFacet = -1;
				
		for (var j = 0; j < facet.edges.length; j++)
		{
			var edge = facet.edges[j];

			if (edge.adjacentFacet != -1)
			{				
				var n1 = pointIndexInList(edge.adjacentFacet.points, edge.start);
				var n2 = pointIndexInList(edge.adjacentFacet.points, edge.end);

				var n1a = pointIndexInList(facet.points, edge.start);
				var n2a = pointIndexInList(facet.points, edge.end);
				
				if (Math.abs(n1 - n2) > 1)
				{
					if (n1 == 0)
					{
						n1 = 4;
					}
					if (n2 == 0)
					{
						n2 = 4;
					}
				}
				if (Math.abs(n1a - n2a) > 1)
				{
					if (n1a == 0)
					{
						n1a = 4;
					}
					if (n2a == 0)
					{
						n2a = 4;
					}
				}
				
				if ((n1 > n2) == (n1a > n2a))
				{
					edge.adjacentFacet.points.reverse();
					nextFacet = edge.adjacentFacet;
				}		
			}
			
			if (nextFacet != -1)
			{
				if (deleteFacetFromList(nextFacet, list))
				{
					list.unshift(nextFacet); // put it at the front
				}
			}
		}		

		if (list.length > 0)
		{
			facet = list[0];
		}
	}
	
	updateCube(cube);
}

function moveSolid(c, moveAmount)
{
	for (var i = 0; i < c.facets.length; i++)
	{		
		for (var j = 0; j < c.facets[i].points.length; j++)
		{
			c.facets[i].points[j].x += moveAmount.x;
			c.facets[i].points[j].y += moveAmount.y;
			c.facets[i].points[j].z += moveAmount.z;			
		}

		if (c.facets[i].normal != -1)
		{
			c.facets[i].normal.start.x += moveAmount.x;
			c.facets[i].normal.start.y += moveAmount.y;
			c.facets[i].normal.start.z += moveAmount.z;
			c.facets[i].normal.end.x += moveAmount.x;
			c.facets[i].normal.end.y += moveAmount.y;
			c.facets[i].normal.end.z += moveAmount.z;
		}
	}	
}

function moveSelectedFacets(moveAmount)
{
	var list = [];
	
	for (var k = 0; k < selectedFacets.length; k++)
	{
		list.push(selectedFacets[k]);
	}
	
	if (!listHas(selectedFacets, hitFacet) && hitFacet != null && hitFacet != undefined && hitFacet != -1)
	{
		list.push(hitFacet);
	}
	
	moveFacets(list, moveAmount);
}

function moveFacets(facets, moveAmount)
{
	moveVertexes(facets[0].cube, moveAmount, getFacetListPoints(facets));
	updateModel();
}

function raiseFacet(c, f, moveAmount)
{
	for (var j = 0; j < f.points.length; j++)
	{
		f.points[j].x += moveAmount.x;
		f.points[j].y += moveAmount.y;
		f.points[j].z += moveAmount.z;				
	}
}

function moveEdges(moveAmount)
{
	var list = [];
	
	for (var z = 0; z < selectedLines.length; z++)
	{
		list.push(selectedLines[z]);
	}
	
	if (!listHas(list, hitLine) && hitLine != null && hitLine != undefined)
	{
		list.push(hitLine);
	}
	
	moveVertexes(list[0].parentFacet.cube, moveAmount, getEdgeListPoints(list));
	updateModel();
}

function rotateOnePointAroundAxis(p, axis, degreesAroundAxis)
{
	orientation = getVectorOrientation(axis);
	rotateAroundAxis(orientation, p, axis, radians_from_degrees(degreesAroundAxis));
}

function moveVertexes(c, moveAmount, vertexList, rotateDegrees, degreesAroundAxis, axis, CENTER)
{
	var rotateDegreesX = 0;
	var rotateDegreesY = 0;
	var rotateDegreesZ = 0;

	var orientation;
	
	if (degreesAroundAxis != undefined)
	{
		orientation = getVectorOrientation(axis);
	}
	
	if (rotateDegrees == undefined)
	{
		rotateDegreesX = 0;
		rotateDegreesY = 0;
		rotateDegreesZ = 0;
	}
	else
	{
		rotateDegreesX = rotateDegrees.x;
		rotateDegreesY = rotateDegrees.y;
		rotateDegreesZ = rotateDegrees.z;
	}	
	
	var avgPoint;
	
	if (rotateDegreesX != 0 || rotateDegreesY != 0 || rotateDegreesZ != 0)
	{
		if (CENTER == undefined)
		{
			avgPoint = averageFacetPoint(vertexList);
		}
		else
		{
			avgPoint = CENTER;
		}
	}
	
	var pointsToMove = [];
	
	for (var vv = 0; vv < vertexList.length; vv++)
	{
		pointsToMove.push(clonePoint3D(vertexList[vv]));
	}
	
	for (var i = 0; i < c.facets.length; i++)
	{		
		for (var j = 0; j < c.facets[i].points.length; j++)
		{
			if (pointIsInList(pointsToMove, c.facets[i].points[j]))
			{
				if (degreesAroundAxis != undefined)
				{
					rotateAroundAxis(orientation, c.facets[i].points[j], axis, radians_from_degrees(degreesAroundAxis));
				}
				else if (rotateDegreesX != 0 || rotateDegreesY != 0 || rotateDegreesZ != 0)
				{
					RotateXYZ(c.facets[i].points[j], avgPoint, radians_from_degrees(rotateDegreesX), radians_from_degrees(rotateDegreesY), radians_from_degrees(rotateDegreesZ));
				}
				else
				{
					c.facets[i].points[j].x += moveAmount.x;
					c.facets[i].points[j].y += moveAmount.y;
					c.facets[i].points[j].z += moveAmount.z;
				}
			}
		}
	}	
}

function pointIsInList(points, p)
{
	for (var i = 0; i < points.length; i++)
	{
		if (pointSameAs(points[i], p))
		{
			return true;
		}
	}
	
	return false;
}

function pointIndexInList(points, p)
{
	for (var i = 0; i < points.length; i++)
	{
		if (pointSameAs(points[i], p))
		{
			return i;
		}
	}
	
	return -1;
}

function pointSameAs(p1, p2)
{
	if (p1.x == p2.x &&	p1.y == p2.y &&	p1.z == p2.z)
	{
		return true;
	}
	
	return false;		
}

function rotateFromMouse()
{
	var xAmount = (pos.x - previousPos.x) / ctx.canvas.width;
	var yAmount = (pos.y - previousPos.y) / ctx.canvas.height;

	rotateFromAmountXY(xAmount, -yAmount);
}

function rotateFromAmountXY(xAmount, yAmount)
{
	degreesY -= xAmount * 360;
	degreesX += yAmount * 360;

	radiansX = radians_from_degrees(degreesX);
	radiansY = radians_from_degrees(degreesY);	
	
	sortFacets();
}

function rotateFromMouseGL()
{
	var xAmount = (posGL.x - previousPosGL.x) / canvas2.width;
	var yAmount = (posGL.y - previousPosGL.y) / canvas2.height;

	rotateFromAmountXYGL(xAmount, -yAmount);
}

function rotateFromAmountXYGL(xAmount, yAmount)
{
	degreesY -= xAmount * 360;
	degreesX -= yAmount * 360;

	radiansX = radians_from_degrees(degreesX);
	radiansY = radians_from_degrees(degreesY);	
	
	cubeRotationX = Math.round(degreesX);
	cubeRotationY = Math.round(-degreesY);
	
	sortFacets();
}

function slideFromMouse()
{
	origin.x -= (pos.x - previousPos.x);
	origin.y -= (pos.y - previousPos.y);
}

function slideFromMouseGL()
{
	slideGL(posGL.x - previousPosGL.x, posGL.y - previousPosGL.y);
}

function slideGL(amountX, amountY)
{
	panXAmountGL += (amountX) * panXIncrementGL;
	panYAmountGL -= (amountY) * panYIncrementGL;
}
function mouseDown(e)
{
	if (isSubdividing)
	{
		return;
	}	

	alertUser("");
	
	draggingRect = false;

	movingFacets = false;
	movingVertex = false;
	movingEdge = false;
	movingSolid = false;
	
	mouseIsDown = true;
	
	rightMouseIsDown = (e.button == 2);

	setPosition(e);	
	mouseDownPos = pointFromMouse(e);	
	
	if (menuIsDisplayed)
	{
		return;
	}
	
	if (toolChosen() == "draw" && !rightMouseIsDown)
	{
		draggingShape = true;
	}
	else if (toolChosen() == "facet" && !rightMouseIsDown)
	{
		if (hitFacet == -1)
		{
			draggingRect = true;
		}
		else
		{
			if (listHas(selectedFacets, hitFacet))
			{
				cloneModel();
				movingFacets = true;
			}
		}
	}
	else if (toolChosen() == "facet" && rightMouseIsDown)
	{
		if (hitFacet != -1)
		{
			showFacetMenu(pos.x, pos.y);
		}
	}
	else if (toolChosen() == "edge" && rightMouseIsDown)
	{
		if (hitLine != -1)
		{
			showEdgeMenu(pos.x, pos.y);
		}
	}
	else if (toolChosen() == "solid" && rightMouseIsDown)
	{
		if (hitSolid != -1)
		{
			showSolidMenu(pos.x, pos.y);
		}
	}
	else if (toolChosen() == "vertex" && rightMouseIsDown)
	{
		if (hitVertex != -1)
		{
			showVertexMenu(pos.x, pos.y);
		}
	}

	draw();
}

function mouseDownGL(e)
{
	if (isSubdividing)
	{
		return;
	}	

	alertUser("");
	
	draggingRect = false;

	movingFacets = false;
	movingVertex = false;
	movingEdge = false;
	movingSolid = false;
	
	mouseIsDown = true;
	
	rightMouseIsDown = (e.button == 2);

	setPositionGL(e);	
}

function mouseUp(e)
{
	if (isSubdividing)
	{
		return;
	}	

	alertUser("");
	
	movingFacets = false;
	mouseIsDown = false;

	if (menuIsDisplayed && !rightMouseIsDown)
	{
		setPosition(e);

		processMenuMouseUp(pos.x, pos.y);
		
		return;
	}

	if (colorPickMode.length > 0)
	{
		setPosition(e);
		if (pos.x > colorPickWidth || pos.y > colorPickHeight)
		{
			colorPickMode = "";

			reloadSceneGL();
			setBackColorGL();
		}
		else
		{
			handleColorMouse(pos.x, pos.y);
		}
		draw();
		return;
	}
	
	if (toolChosen() == "draw")
	{
		if (draggingShape)
		{
			var rectangle = new Facet();
		
			rectangle.point1 = planeIntersect3D(mouseDownPos.x, mouseDownPos.y);
			rectangle.point2 = planeIntersect3D(pos.x, pos.y);
			
			rectangle.fill = false;
			
			make3DRectangleFrom2DPoints(rectangle, mouseDownPos, pos);
					
			var cube = makeCube();
			
			cube.facets = [];
			
			cube.facets.push(rectangle);
			
			rectangle.cube = cube;
			
			updateModel();
		}
	}

	if (toolChosen() == "facet")
	{
		if (draggingRect)
		{
			selectedFacets = [];
			
			for (var e = 0; e < allFacets.length; e++)
			{
				if (facetIsWithin(mouseDownPos, pos, allFacets[e]))
				{
					selectedFacets.push(allFacets[e]);
				}
			}
			
			if (hitFacet != -1 && !listHas(selectedFacets, hitFacet))
			{
				selectedFacets.push(hitFacet);
			}
		}
		else
		{
			if (hitFacet == -1 && !rightMouseIsDown)
			{
				selectedFacets = [];
			}
			else
			{
				if (hitFacet != -1 && !listHas(selectedFacets, hitFacet))
				{
					selectedFacets.push(hitFacet);
				}
			}
		}
	}
	
	if (toolChosen() == "solid")
	{
		if (hitSolid == -1)
		{
			selectedSolids = [];
		}
		else
		{
			if (!listHas(selectedSolids, hitSolid))
			{
				selectedSolids.push(hitSolid);
			}
			setFacetCount(hitSolid);
		}
	}

	
	draggingRect = false;
	draggingShape = false;
	
	setPosition(e);
	
	draw();	
}

function mouseUpGL(e)
{
	if (isSubdividing)
	{
		return;
	}	

	alertUser("");
	
	movingFacets = false;
	mouseIsDown = false;


	draggingRect = false;
	draggingShape = false;
	
	setPositionGL(e);
}

function colorString(color, transparent)
{
	if (transparent)
	{
		return "rgba(" + Math.round(color.R) +	"," + Math.round(color.G) +	"," + Math.round(color.B) +	", 0.6)";
	}
	else
	{
		return "rgb(" + Math.round(color.R) +	"," + Math.round(color.G) +	"," + Math.round(color.B) +	")";
	}
}

function drawPolygon(points, isClosed, isFill, fillColor, isOutline, outlineColor, lineThickness)
{
	if (points.length > 0)
	{
		isClosed = isClosed ? isClosed : false;
		isFill = isFill ? isFill : false;
		if (isOutline === undefined)
		{
			isOutline = true;
		}
		if (lineThickness === undefined)
		{
			lineThickness = 1;
		}
		if (outlineColor === undefined)
		{
			outlineColor = lineColor;
		}
		
		ctx.beginPath();

		ctx.lineWidth = lineThickness;
		ctx.lineCap = 'round';
		ctx.strokeStyle = outlineColor;
		if (isFill)
		{
			ctx.fillStyle = fillColor;
		}

		ctx.moveTo(points[0].x, points[0].y);
		for (var i = 1; i < points.length; i++)
		{		
			ctx.lineTo(points[i].x, points[i].y);
		}
		
		if (isClosed)
		{
			ctx.lineTo(points[0].x, points[0].y);
		}

		if (isFill)
		{
			ctx.fill();	
		}
		
		if (isOutline)
		{
			ctx.stroke();
		}
	}
}

function fillRectangle(left, top, width, height, fillColor)
{
	ctx.fillStyle = fillColor;

	ctx.fillRect(left, top, width, height);
}

function drawPolygonHighlighted(points, isClosed, isFill, fillColor)
{
	drawPolygon(points, false, false, "", true, "magenta", 3);
}

function drawPolygonSelected(points, isClosed, isFill, fillColor)
{
	drawPolygon(points, false, false, "", true, "lime", 3);
}

function drawPolygon3d(points, isClosed, isFill, fillColor, isOutline, outlineColor)
{
	var result = [];
	
	if (points.length > 0)
	{
		for (var i = 0; i < points.length; i++)
		{
			result.push(To2D(points[i]));
		}
	
		drawPolygon(result, isClosed, isFill, fillColor, isOutline, outlineColor);
	}
}

function drawText3D(text, point3, size)
{
	var p = To2D(point3);

	ctx.fillStyle = "black";
	ctx.font = "20px Georgia";
	
	if (size == undefined)
	{
		size = 20;
	}
	
	ctx.font = size + "px Georgia";
	
	ctx.fillText(text, p.x, p.y);
}

function pointsToInts(points)
{
	var ints = [];
	
	for (var i = 0; i < points.length; i++)
	{	
		ints.push(points[i].x);
		ints.push(points[i].y);
	}

	return ints;
}

function intsToPoints(ints)
{
	var points = [];
	
	for (var i = 0; i < ints.length; i = i + 2)
	{	
		points.push(new Point(ints[i], ints[i + 1]));
	}

	return points;
}


function drawThermometer(total, amount)
{
	var height = 20;

	ctx.fillStyle = "black";
	ctx.fillRect(0, ctx.canvas.height - height, ctx.canvas.width, height);	
	
	ctx.fillStyle = "white";
	
	var width = (ctx.canvas.width * amount) / total;
	
	ctx.fillRect(0, ctx.canvas.height - height, width, height);	
}


function drawMenu()
{
	if (menuIsDisplayed)
	{
		var fontHeight = 14;
		
		ctx.font = fontHeight + "px Verdana";
		ctx.textAlign = "left";

		var x = menuX;
		var y = menuY;
		
		for (var g = 0; g < menuItems.length; g++)
		{
			ctx.fillStyle = "white";
			if (menuItems[g] == menuItemChosen)
			{
				ctx.fillStyle = "grey";
			}
			ctx.fillRect(x, y, menuWidth, menuItemHeight);
			ctx.fillStyle = "black";
			y += menuItemHeight;
			ctx.fillText(menuItems[g], x + 10, y - ((menuItemHeight - fontHeight) / 2)); 
		}
	}
}

function showFacetMenu(x, y)
{
	menuName = "Facet";

	menuItems = [];
	menuItems.push("Extrude");
	menuItems.push("Extrude Group");
	menuItems.push("Extrude Series");
	menuItems.push("Bevel");
	menuItems.push("Flare");
	menuItems.push("Delete");
	menuItems.push("Reverse");
	menuItems.push("Raise");
	menuItems.push("Indent");
	menuItems.push("Bridge");
	menuItems.push("Tunnel");
	menuItems.push("Slab");
	menuItems.push("Texture");

	showMenu(x, y);
}

function showVertexMenu(x, y)
{
	menuName = "Vertex";

	menuItems = [];
	menuItems.push("Knit");

	showMenu(x, y);
}

function showSolidMenu(x, y)
{
	menuName = "Solid";

	menuItems = [];
	menuItems.push("Clone");
	menuItems.push("Delete");
	menuItems.push("Smooth");
	menuItems.push("Revert");
	menuItems.push("Freeze");
	menuItems.push("Reflect");
	menuItems.push("Mirror");
	menuItems.push("Combine");
	menuItems.push("Color");
	menuItems.push("Outline Color");
	menuItems.push("Texture");
	menuItems.push("Unify");

	showMenu(x, y);
}

function showEdgeMenu(x, y)
{
	menuName = "Edge";

	menuItems = [];
	menuItems.push("Split");
	menuItems.push("Edge Loop");
	menuItems.push("Facet Loop");
	
	showMenu(x, y);
}

function showMenu(x, y)
{
	alertUser("");

	if (x > ctx.canvas.width - menuWidth)
	{
		x -= menuWidth;
	}
	if (y > ctx.canvas.height - (menuItems.length * menuItemHeight))
	{
		y -= (menuItems.length * menuItemHeight);
		y = Math.max(y, 0);
	}
	
	menuX = x;
	menuY = y;

	menuIsDisplayed = true;
	
	draw();
}

function hideMenu()
{
	menuIsDisplayed = false;
	draw();
}

function processMenuMouseMove(x, y)
{
	menuItemChosen = menuItemHit(x, y);
	drawMenu();
}

function processMenuMouseUp(x, y)
{
	alertUser("");

	menuItemChosen = menuItemHit(x, y);

	hideMenu();
	
	if (menuItemChosen == "")
	{
		return;
	}
	else
	{
		if (menuName == "Vertex")
		{
			if (menuItemChosen == "Knit")
			{
				knitFacets(selectedVertexes);
			}
		}
		else if (menuName == "Solid")
		{
			if (menuItemChosen == "Delete")
			{
				cloneModel();
				deleteSelectedSolids();
			}
			if (menuItemChosen == "Clone")
			{
				cloneSelectedCubes();
			}
			if (menuItemChosen == "Smooth")
			{
				subdivide();
			}
			if (menuItemChosen == "Unify")
			{
				unify();
			}
			if (menuItemChosen == "Revert")
			{
				revertSubdivide();
			}
			if (menuItemChosen == "Freeze")
			{
				freezeSubdivide();
			}
			if (menuItemChosen == "Reflect")
			{
				showReflectForm();
			}
			if (menuItemChosen == "Mirror")
			{
				showMirrorForm();
			}
			if (menuItemChosen == "Combine")
			{
				combineSolids();
			}
			if (menuItemChosen == "Color")
			{
				includeHitSolid();
				changeColor();
			}
			if (menuItemChosen == "Outline Color")
			{
				includeHitSolid();
				changeOutlineColor();
			}
			if (menuItemChosen == "Texture")
			{
				includeHitSolid();
				showTextureForm();
			}

		}
		else if (menuName == "Facet")
		{
			if (menuItemChosen == "Delete")
			{
				cloneModel();
				deleteSelectedFacets();
			}
			else if (menuItemChosen == "Texture")
			{
				showFacetTextureForm();
			}
			else if (menuItemChosen == "Bevel")
			{
				bevelSelectedFacets();
			}
			else if (menuItemChosen == "Flare")
			{
				flareSelectedFacets();
			}
			else if (menuItemChosen == "Extrude")
			{
				showExtrudeForm();
			}
			else if (menuItemChosen == "Extrude Group")
			{
				showExtrudeGroupForm();
			}
			else if (menuItemChosen == "Extrude Series")
			{
				showExtrudeSeriesForm();
			}
			else if (menuItemChosen == "Reverse")
			{
				reverseSelectedFacets();
			}
			else if (menuItemChosen == "Raise")
			{
				showRaiseForm();
			}
			else if (menuItemChosen == "Indent")
			{
				showIndentForm();
			}
			else if (menuItemChosen == "Slab")
			{
				showSlabForm();
			}
			else if (menuItemChosen == "Bridge")
			{
				showBridgeForm();
			}
			else if (menuItemChosen == "Tunnel")
			{
				showTunnelForm();
			}
		}
		if (menuName == "Edge")
		{
			if (menuItemChosen == "Split")
			{
				splitEdge();
			}
			else if (menuItemChosen == "Edge Loop")
			{
				edgeLoop();
			}
			else if (menuItemChosen == "Facet Loop")
			{
				facetLoop();
			}
		}
	
		draw();
	}
}

function menuItemHit(x, y)
{
	if (x > menuX && x < menuX + menuWidth && y > menuY && y < menuY + (menuItems.length * menuItemHeight))
	{
		for (var i = 0; i < menuItems.length; i++)
		{
			if (y <  menuY + (((i + 1) * menuItemHeight)))
			{
				return menuItems[i];
			}
		}
	}

	return "";
}

function initTextures() 
{
	// to load textures from local files, run this command to start chrome
	// chrome --allow-file-access-from-files
	cubeTexture = gl.createTexture();
	cubeImage = new Image();
	cubeImage.onload = function() { handleTextureLoaded(cubeImage, cubeTexture); }
	cubeImage.src = "textures.png";
}

function handleTextureLoaded(image, texture) 
{
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
	
	drawSceneGL();
}

function rebuildGL()
{
	if (isGL && gl != null)
	{
		startGL();
	}
}

function draw() 
{
	if (isGL && gl != null)
	{
		drawSceneGL();
	}
	
	if (is2dWindow || !isGL)
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		findGridOrientation();
		
		if (gridChosen())
		{		
			drawGridXY();
		}
		
		lineColor = lineColorShape;
		
		drawCubes();
		
		if (mouseIsDown && draggingShape)
		{
			draw3DRectangleFrom2DPoints(mouseDownPos, pos, false, "white");		
		}
			
		if (hitLine != -1)
		{
			var pts = [];
			pts.push(To2D(hitLine.start));
			pts.push(To2D(hitLine.end));
			drawPolygonHighlighted(pts);
		}
		
		if (hitFacet != -1 && toolChosen() == "facet")
		{
			drawPolygon3d(hitFacet.points, true, true, "yellow", true);
		}
		
		for (var g = 0; g < selectedLines.length; g++)
		{
			var pts = [];
			pts.push(To2D(selectedLines[g].start));
			pts.push(To2D(selectedLines[g].end));
			drawPolygonSelected(pts);
		}
		
		if (hitVertex != -1)
		{
			drawVertex(hitVertex, false);
		}

		for (var qq = 0; qq < selectedVertexes.length; qq++)
		{
			drawVertex(selectedVertexes[qq], true);
		}
		
		if (lineDiv != -1 &&
			lineDiv2 != -1)
		{
			drawLine2D(lineDiv, "blue");
			drawLine2D(lineDiv2, "blue");
		}
		
		if (draggingRect)
		{
			draw2DRectangleFrom2DPoints(mouseDownPos, pos, "black");		
		}
		
		if (colorPickMode.length > 0)
		{
			drawColors(0, 0, colorPickHeight);
		}
		
		drawMenu();
	}
}

function drawColors(left, Top, height)
{
	var hueBandWidth = 50;
	var top = Top;
	var steps = 11;

	var step = Math.floor(height / steps);
	
	var saturation = 1.0;
	var luminance = 0.5;
	
	var hueStep = 10;
	
	for (var nSat = 0; nSat < steps; nSat++)
	{
		var y = top + (nSat * step);
		
		for (var hue = 0; hue < 360; hue += hueStep)
		{	
			var x = left + hue;
			
			var rgb = HSLtoRGB(hue, saturation, luminance);
			
			fillRectangle(x, y, hueStep, step, colorString(new Color(rgb.r, rgb.g, rgb.b), false));
		}
				
		saturation -= 1.0 / (steps - 1);
	}		
	
	left += 360;
	
	luminance = 1;
	
	for (var nLum = 0; nLum < steps; nLum++)
	{
		hue = colorPickHue;
		saturation = colorPickSaturation;

		var x = left;
		var y = top + (nLum * step);
			
		var rgb = HSLtoRGB(hue, saturation, luminance);
			
		fillRectangle(x, y, hueBandWidth, step, colorString(new Color(rgb.r, rgb.g, rgb.b), false));

		luminance -= 1.0 / (steps - 1);
	}
	
	var x = left + hueBandWidth;
	var rgb = HSLtoRGB(hue, colorPickSaturation, colorPickLuminosity);
	fillRectangle(x, top, colorPickWidth - (360 + hueBandWidth), 
			step * steps, 
			colorString(new Color(rgb.r, rgb.g, rgb.b), false));
}

function drawVertex(vertex, isSelected)
{
	var size = 5;
		
	var pts = [];
		
	var p = To2D(vertex);
		
	pts.push(new Point(p.x - size, p.y - size));
	pts.push(new Point(p.x + size, p.y - size));
	pts.push(new Point(p.x + size, p.y + size));
	pts.push(new Point(p.x - size, p.y + size));
	pts.push(new Point(p.x - size, p.y - size));
		
	if (isSelected)
	{
		drawPolygonSelected(pts);
	}
	else
	{
		drawPolygonHighlighted(pts);
	}
}

function sortFacets()
{
	allFacets = [];

	for (var w = 0; w < cubes.length; w++)
	{
		var cube = cubes[w];
		
		for (var i = 0; i < cube.facets.length; i++)
		{
			allFacets.push(cube.facets[i]);
		}		
	}

	sortFacetsOnZ(allFacets);
}

function stageVertexNeighborFacets(sortedPoints)
{
	for (var i = 0; i < sortedPoints.length; i++)
	{
		var neighbors = [];

		neighbors.push(sortedPoints[i].facet);
		
		for (var d = 1; d < 10; d++)
		{
			var before = i - d;
			
			if (before >= 0)
			{
				if (pointSameAs(sortedPoints[i], sortedPoints[before]))
				{
					if (!listHas(neighbors, sortedPoints[before].facet))
					{
						neighbors.push(sortedPoints[before].facet);
					}
				}
				else
				{
					break;
				}
			}
			else
			{
				break;
			}
		}
		
		for (var d = 1; d < 10; d++)
		{
			var after = i + d;
			
			if (after < sortedPoints.length)
			{
				if (pointSameAs(sortedPoints[i], sortedPoints[after]))
				{
					if (!listHas(neighbors, sortedPoints[after].facet))
					{
						neighbors.push(sortedPoints[after].facet);
					}
				}
				else
				{
					break;
				}
			}
			else
			{
				break;
			}
		}

		sortedPoints[i].neighborFacets = neighbors;
	}
}

function getFacetPointsAndSetUpBackPointers(facets)
{
	var points = [];
	
	for (var i = 0; i < facets.length; i++)
	{
		for (var j = 0; j < facets[i].points.length; j++)
		{
			facets[i].points[j].facet = facets[i]; // set up pointer to facet
			points.push(facets[i].points[j]);
		}
	}
	
	return points;
}

function searchSamePointFacets(points, p1)
{
	var facets = [];
	
	for (var i = 0; i < points.length; i++)
	{
		var p2 = points[i];
		
		if (pointSameAs(p1, p2))
		{
			if (!listHas(facets, p2.facet))
			{
				facets.push(p2.facet);
			}
		}
		
		if (p2.x > p1.x)
		{
			break;
		}
		else if (p2.x == p1.x)
		{
			if (p2.y > p1.y)
			{
				break;
			}
			else if (p2.y == p1.y)
			{
				if (p2.z > p1.z)
				{
					break;
				}
			}
		}
	}
	
	return facets;
}

function sortPointsByXYZ(points)
{
	points.sort(
					function(a, b)
					{
						if (a.x == b.x)
						{
							if (a.y == b.y)
							{
								return a.z - b.z;
							}
							else
							{
								return a.y - b.y;
							}
						}
						else
						{
							return a.x - b.x;
						}
					}
	);
	
	return points;
}

function drawCubes()
{
	var drawlines = isOutline || !isShade;

	var drawNormals = isNormals;

	var shadeSolids = isShade;
	
	var dual = isDualSided;
	
	for (var i = 0; i < allFacets.length; i++)
	{
		var facet = allFacets[i];
	
		if (facet.normal == -1)
		{
			facet.normal = CalculateNormal(facet);
		}

		var c = facet.cube.color;
		
		if (colorPickMode.length == 0)
		{
			if (facet.cube == hitSolid)
			{
				c = new Color(23, 100, 123);
			}	
			
			if (listHas(selectedSolids, facet.cube))
			{
				c = new Color(200, 30, 144);
			}
				
			if (listHas(selectedFacets, facet))
			{
				c = new Color(0, 255, 255);
			}
		}
			
		c = ShadeFacet(c, degrees_from_radians(getLightSourceAngle(facet.normal)));
		var show = true;
		
		if (!dual)
		{
			show = ShowFacet(degrees_from_radians(getFrontSourceAngle(facet.normal)));
		}
			
		var colorFillStyle = colorString(c, isTransparent);
		
		var colorOutlineStyle = colorString(facet.cube.outlineColor, isTransparent);	
			
		if (listHas(selectedSolids, facet.cube))
		{
			drawlines = true;
			colorOutlineStyle = "red";
		}
		
		if (show)
		{
			drawPolygon3d(facet.points, true, shadeSolids || listHas(selectedFacets, facet), 
				colorFillStyle, drawlines, colorOutlineStyle);
			
			if (drawNormals)
			{
				drawLine3D(facet.normal, "magenta");
			}
		}
	}
}

function drawOrtho(segment)
{
	var orientation = getVectorOrientation(segment);

	var ortho = getOrthoOfAxis(segment);
	
	var xAngle = RadiansFromRotationPoint3D("x", ortho.end, ortho.start);
	var yAngle = RadiansFromRotationPoint3D("y", ortho.end, ortho.start);
	var zAngle = RadiansFromRotationPoint3D("z", ortho.end, ortho.start);

	drawLine3D(ortho, "yellow",  Math.round(degrees_from_radians(xAngle), 2) + 
	   					   " " + Math.round(degrees_from_radians(yAngle), 2) + 
						   " " + Math.round(degrees_from_radians(zAngle), 2) );
}

function drawLine3D(myLine, color, text, textSize)
{
	if (typeof myLine === "undefined")
	{
	}
	else if (typeof myLine === "null")
	{
	}
	else
	{
		var points = [];
		
		points.push(myLine.start);
		points.push(myLine.end);
		
		drawPolygon3d(points, false, false, color, true, color);	
		
		if (text != undefined)
		{
			drawText3D(text, myLine.end, textSize);
		}
	}
}

function drawLine2D(myLine, color)
{
	if (typeof myLine === "undefined")
	{
	}
	else if (typeof myLine === "null")
	{
	}
	else
	{
		var points = [];
		
		points.push(myLine.start);
		points.push(myLine.end);
		
		drawPolygon(points, false, false, color, true, color);	
	}
}

function getFacetLines(f)
{
	var lines = [];
	
	for (var j = 1; j < f.points.length; j++)
	{
		lines.push(new line(f.points[j - 1], f.points[j]));
	}
		
	lines.push(new line(f.points[f.points.length - 1], f.points[0]));		
	
	for (var t = 0; t < lines.length; t++)
	{
		lines[t].parentFacet = f;
	}
	
	return lines;
}

function getVertexCube(p)
{
	for (var x = 0; x < cubes.length; x++)
	{
		for (var f = 0; f < cubes[x].facets.length; f++)
		{
			for (var u = 0; u < cubes[x].facets[f].points.length; u++)
			{
				if (pointSameAs(p, cubes[x].facets[f].points[u]))
				{
					return cubes[x];
				}
			}
		}
	}
	
	return null;
}

function getLines(cube)
{
	var lines = [];
	
	for (var i = 0; i < cube.facets.length; i++)
	{
		for (var j = 1; j < cube.facets[i].points.length; j++)
		{
			var l = new line(cube.facets[i].points[j - 1], cube.facets[i].points[j]);
			l.parentFacet = cube.facets[i];
			lines.push(l);
		}
		
		var ll = new line(cube.facets[i].points[cube.facets[i].points.length - 1], cube.facets[i].points[0]);
		ll.parentFacet = cube.facets[i];
		lines.push(ll);		
	}
	
	return lines;
}

function averageFacetPoint(points) // this returns the non-rotated average
{
	if (points.length == 0)
	{
		return new Point3D(0, 0, 0);
	}

	var x = 0;
	var y = 0;
	var z = 0;

	for (var i = 0; i < points.length; i++)
	{		
		x += points[i].x;
		y += points[i].y;
		z += points[i].z;
	}

	var result = new Point3D(x / points.length, y / points.length, z / points.length);

	return roundPoint(result);
}

function leastAndMostFacetPointZ(points)
{
	if (points.length == 0)
	{
		return new Point3D(0, 0, 0);
	}

	var zLeast = Number.MAX_VALUE;
	var zMost = Number.MIN_VALUE;

	for (var i = 0; i < points.length; i++)
	{		
		if (points[i].z < zLeast)
		{
			zLeast = points[i].z;
		}
		if (points[i].z > zMost)
		{
			zMost = points[i].z;
		}
	}

	var result = new Point(zLeast, zMost);

	return result;
}

function facetListBounds(facets)
{
	var points = getFacetListPoints(facets);
	
	if (points.length == 0)
	{
		return new cube(0, 0, 0, 0, 0, 0);
	}

	var xLeast = Number.MAX_VALUE;
	var xMost = Number.MIN_VALUE;

	var yLeast = Number.MAX_VALUE;
	var yMost = Number.MIN_VALUE;

	var zLeast = Number.MAX_VALUE;
	var zMost = Number.MIN_VALUE;

	for (var i = 0; i < points.length; i++)
	{		
		if (points[i].x < xLeast)
		{
			xLeast = points[i].x;
		}
		if (points[i].x > xMost)
		{
			xMost = points[i].x;
		}

		if (points[i].y < yLeast)
		{
			yLeast = points[i].y;
		}
		if (points[i].y > yMost)
		{
			yMost = points[i].y;
		}

		if (points[i].z < zLeast)
		{
			zLeast = points[i].z;
		}
		if (points[i].z > zMost)
		{
			zMost = points[i].z;
		}
	}

	var bounds = new cube(xLeast, xMost, yLeast, yMost, zLeast, zMost);

	return bounds;
}

function setAverageAndGreatestRotatedZ(facet)
{
	var greatest = -100000000;
	var least = 100000000;
	var average = 0;
	
	for (var i = 0; i < facet.points.length; i++)
	{
		var point3d = new clonePoint3D(facet.points[i]);	
		RotateXYZ(point3d, myCenter, radiansX, radiansY, radiansZ);
	
		average += point3d.z;

		if (point3d.z > greatest)
		{
			greatest = point3d.z;
		}
		if (point3d.z < least)
		{
			least = point3d.z;
		}
	}
	
	average /= facet.points.length;
	
	facet.greatestRotatedZ = greatest;
	facet.averageRotatedZ = average;
}


function sortFacetsOnZ(facets)
{
	for (var i = 0; i < facets.length; i++)
	{
		setAverageAndGreatestRotatedZ(facets[i]);
	}

	facets.sort(
					function(a, b)
					{
						if (a.greatestRotatedZ == b.greatestRotatedZ)
						{
							if (a.leastRotatedZ == b.leastRotatedZ)
							{
								return a.averageRotatedZ - b.averageRotatedZ;
							}
							else
							{
								return a.leastRotatedZ - b.leastRotatedZ;
							}
						}
						else
						{
							return a.greatestRotatedZ - b.greatestRotatedZ
						}
					}
	);
}

function draw2DRectangleFrom2DPoints(point1, point2, color) 
{
	var points = [];
	
	points.push(new Point(point1.x, point1.y));
	points.push(new Point(point2.x, point1.y));
	points.push(new Point(point2.x, point2.y));
	points.push(new Point(point1.x, point2.y));

	drawPolygon(points, true, false, "", true, color, 1);
}

function draw3DRectangleFrom3DPoints(point1, point2, fill, fillColor) 
{
	var points = [];
	
	points.push(new Point3D(point1.x, point1.y, 0));
	points.push(new Point3D(point2.x, point1.y, 0));
	points.push(new Point3D(point2.x, point2.y, 0));
	points.push(new Point3D(point1.x, point2.y, 0));
	points.push(new Point3D(point1.x, point1.y, 0));

	drawPolygon3d(points, true, fill, fillColor, true);
}

function draw3DRectangleFrom2DPoints(point1, point2, fill, fillColor) 
{
	var points = [];
	
	var p1 = planeIntersect3D(point1.x, point1.y);
	var p3 = planeIntersect3D(point2.x, point2.y);

	var p2 = new Point3D(p3.x, p1.y, 0);
	var p4 = new Point3D(p1.x, p3.y, 0);	
	var p5 = new Point3D(p1.x, p1.y, 0);

	if (gridIsZY)
	{
		p2 = new Point3D(0, p1.y, p3.z);
		p4 = new Point3D(0, p3.y, p1.z);	
		p5 = new Point3D(0, p1.y, p1.z);
	}
	
	points.push(p1);
	points.push(p2);
	points.push(p3);
	points.push(p4);
	points.push(p5);
	
	drawPolygon3d(points, true, fill, fillColor, true, "red");
}

function make3DRectangleFrom2DPoints(rect, point1, point2) 
{
	var points = [];
	
	var p1 = planeIntersect3D(point1.x, point1.y);
	var p3 = planeIntersect3D(point2.x, point2.y);

	var p2 = new Point3D(p3.x, p1.y, 0);
	var p4 = new Point3D(p1.x, p3.y, 0);	
	var p5 = new Point3D(p1.x, p1.y, 0);

	if (gridIsZY)
	{
		p2 = new Point3D(0, p1.y, p3.z);
		p4 = new Point3D(0, p3.y, p1.z);	
		p5 = new Point3D(0, p1.y, p1.z);
	}
	
	points.push(p1);
	points.push(p2);
	points.push(p3);
	points.push(p4);

	rect.points = points;
	
	rect.edges = getFacetLines(rect);
}

function listHas(list, element)
{
	for (var i = 0; i < list.length; i++)
	{
		if (list[i] == element)
		{
			return true;
		}
	}
	
	return false;
}


function getFacetPoints(facets)
{
	var pts = [];
	
	for (var i = 0; i < facets.length; i++)
	{
		var facet = cube.facets[i];
		for (var j = 0; j < facet.points.length; j++)
		{
			pts.push(facet.points[j]);
		}
	}
	
	return pts;
}

function fusePoints(p1, p2)
{
	p1.x = Math.round(p1.x, 3);
	p1.y = Math.round(p1.y, 3);
	p1.z = Math.round(p1.z, 3);
	
	p2.x = p1.x;
	p2.y = p1.y;
	p2.z = p1.z;	
}

function findFacetNeighborsAndAdjacents(facets)
{
	var sortedPoints = getFacetPointsAndSetUpBackPointers(facets);
	sortPointsByXYZ(sortedPoints);
	stageVertexNeighborFacets(sortedPoints);
	
	for (var i = 0; i < facets.length; i++)
	{
		facets[i].neighbors = [];
	
		for (var j = 0; j < facets[i].edges.length; j++)
		{
			var edge = facets[i].edges[j];
			
			for (var k = 0; k < edge.start.neighborFacets.length; k++)
			{
				var facet = edge.start.neighborFacets[k];
				
				if (facet != facets[i])
				{
					if (listHas(edge.end.neighborFacets, facet))
					{
						edge.adjacentFacet = facet;
					}

					if (!listHas(facets[i].neighbors, facet))
					{
						facets[i].neighbors.push(facet);
					}
				}
			}

			for (var k = 0; k < edge.end.neighborFacets.length; k++)
			{
				var facet = edge.end.neighborFacets[k];
				
				if (facet != facets[i])
				{
					if (!listHas(facets[i].neighbors, facet))
					{
						facets[i].neighbors.push(facet);
					}
				}
			}
		}
	}	
}

function fuseFaster(cube)
{
	var pts = getFacetPointsAndSetUpBackPointers(cube.facets);
	sortPointsByXYZ(pts);
	
	var limit = 100;
	
	for (var i = 0; i < pts.length; i++)
	{
		for (var d = 1; d < limit; d++)
		{
			var before = i - d;
			
			if (before >= 0)
			{
				if (almostSame(pts[i], pts[before]))
				{
					fusePoints(pts[i], pts[before]);
				}
				else
				{
					if (Math.abs(pts[i].x - pts[before].x) > vertexClosenessLimit)
					{
						break;
					}
				}
			}
		}
		
		for (var d = 1; d < limit; d++)
		{
			var after = i + d;
			
			if (after < pts.length)
			{
				if (almostSame(pts[i], pts[after]))
				{
					fusePoints(pts[i], pts[after]);
				}
				else
				{
					if (Math.abs(pts[i].x - pts[after].x) > vertexClosenessLimit)
					{
						break;
					}
				}
			}
		}
	}
}

function almostSame(pt1, pt2)
{
	if (Math.abs(pt1.x - pt2.x) < vertexClosenessLimit &&
		Math.abs(pt1.y - pt2.y) < vertexClosenessLimit &&
		Math.abs(pt1.z - pt2.z) < vertexClosenessLimit)
	{
		return true;	
	}
	
	return false;
}

function facetLoop()
{
	includeHitLine();

	if (selectedLines.length == 1)
	{
		var line = selectedLines[0];
		
		var edges = [];
		
		updateCube(line.parentFacet.cube);
		
		var facets = getfacetLoopList(line, edges);
	
		selectedFacets = [];
		
		for (var y = 0; y < facets.length; y++)
		{
			selectedFacets.push(facets[y]);
		}
	
		selectedLines = [];
		selectedLine = -1;
		hitLine = -1;
	
		draw();
	}
	else
	{
		alertUser("Please select one edge.");
	}

}

function includeHitLine()
{
	if (hitLine != -1 && !isLineInList(hitLine, selectedLines))
	{
		selectedLines.push(hitLine);
	}
}

function edgeLoop()
{
	includeHitLine();

	if (selectedLines.length == 1)
	{
		var line = selectedLines[0];
		
		var cube = line.parentFacet.cube;
		
		updateCube(cube);
		
		var perps = [];
		
		for (var f = 0; f < line.parentFacet.edges.length; f++)
		{
			if (linesConnect(line, line.parentFacet.edges[f]))
			{
				perps.push(line.parentFacet.edges[f]);
			}
		}
		
		var facets = [];
		var perpEdges = [];
		
		if (perps.length == 2)
		{
			var edge = perps[0];
			facets = getfacetLoopList(edge, perpEdges);
		}	
				
		var result = [];
		
		result.push(line);
		
		for (var i = 0; i < facets.length; i++)
		{
			var myFacet = facets[i];
			
			for (var j = 0; j < myFacet.edges.length; j++)
			{
				var myEdge = myFacet.edges[j];
				
				if (!isLineInList(myEdge, perpEdges))
				{
					if (linesConnect(myEdge, line))
					{
						result.push(myEdge);
						line = myEdge;
					}
				}
			}
		}
		
		selectedLines = [];
		
		for (var o = 0; o < result.length; o++)
		{
			selectedLines.push(result[o]);
		}
		
		draw();
	}
	else
	{
		alertUser("Please select one edge.");
	}
}

function getfacetLoopList(edge, edges)
{
	var facets = [];

	var limit = 0;
	while (limit < 2000)
	{
		facets.push(edge.parentFacet);
	
		var opposite = oppositeEdge(edge);
		
		edges.push(cloneLine3D(edge));
		edges.push(cloneLine3D(opposite));
		
		var nextFacet = opposite.adjacentFacet;
		
		if (nextFacet == -1 || nextFacet == undefined || nextFacet == null || listHas(facets, nextFacet))
		{
			break;
		}
		else
		{
			edge = findLineInFacet(opposite, nextFacet);
		}
		
		limit++;
	}

	return facets;
}

function updateModel()
{
	for (var c = 0; c < cubes.length; c++)
	{
		updateCube(cubes[c]);
	}

	sortFacets();
	
	reloadSceneGL();
	
	draw();
}

function updateCube(cube)
{
	var cubeFacets = cube.facets;
	
	for (var i = 0; i < cubeFacets.length; i++)
	{
		cubeFacets[i].edges = getFacetLines(cubeFacets[i]);
		cubeFacets[i].averagePoint3D = averageFacetPoint(cubeFacets[i].points);
		
		cubeFacets[i].normal = CalculateNormal(cubeFacets[i]);
	}
	
	findFacetNeighborsAndAdjacents(cubeFacets);	
}

function splitEdge()
{
	includeHitLine();

	if (selectedLines.length == 1)
	{
		cloneModel();
	
		var selectedLine = selectedLines[0];
		var allFacets = selectedLine.parentFacet.cube.facets;

		fuseFaster(selectedLine.parentFacet.cube);
		updateCube(selectedLine.parentFacet.cube);
		
		var edges = [];
		var facets = getfacetLoopList(selectedLine, edges);
		
		splitFacetLoop(facets, edges);
		
		fuseFaster(selectedLine.parentFacet.cube);
		
		selectedLine = -1;
	}
	else
	{
		alertUser("Please select one edge.");
	}
	
	updateModel();
	
	draw();
}

function splitFacetLoop(facets, edges)
{
	if (edges.length == facets.length * 2)
	{
		var m = 0;
		
		for (var n = 0; n < facets.length; n++)
		{
			splitFacetByEdges(edges[m], edges[m + 1]);		
			m += 2;
		}
	}
}

function splitFacetByEdges(edge1, edge2)
{
	var c = edge1.parentFacet.cube;
	
	deleteFacet(edge1.parentFacet);
	
	var newFacet = new Facet();
	newFacet.points.push(clonePoint3D(edge1.start));
	newFacet.points.push(midPoint3D(edge1.start, edge1.end));
	newFacet.points.push(midPoint3D(edge2.start, edge2.end));
	newFacet.points.push(clonePoint3D(edge2.end));									 
	c.facets.push(newFacet);
	newFacet.cube = c;
	newFacet.normal = CalculateNormal(newFacet);
	
	var newFacet2 = new Facet();
	newFacet2.points.push(clonePoint3D(edge2.start));
	newFacet2.points.push(midPoint3D(edge2.start, edge2.end));
	newFacet2.points.push(midPoint3D(edge1.start, edge1.end));
	newFacet2.points.push(clonePoint3D(edge1.end));									 
	c.facets.push(newFacet2);
	newFacet2.cube = c;
	newFacet2.normal = CalculateNormal(newFacet2);
}

function findLineInFacet(line, facet)
{
	for (var n = 0; n < facet.edges.length; n++)
	{
		if (lineSameAs(line, facet.edges[n]))
		{
			return facet.edges[n];
		}
	}	
}

function isLineInList(line, edges)
{
	for (var n = 0; n < edges.length; n++)
	{
		if (lineSameAs(line, edges[n]))
		{
			return true;
		}
	}	
	
	return false;
}

function isLineInFacetList(line, facets, facetToExclude)
{
	for (var n = 0; n < facets.length; n++)
	{
		if (facets[n] != facetToExclude && isLineInList(line, facets[n].edges))
		{
			return true;
		}
	}	
	
	return false;
}

function oppositeEdge(line)
{
	var facet = line.parentFacet;
	
	var x = 0;
	
	for (var n = 0; n < facet.edges.length; n++)
	{
		if (lineSameAs(line, facet.edges[n]))
		{
			if (n >= 2)
			{
				x = n - 2;
			}
			else
			{
				x = n + 2;
			}
		}
	}
	
	return facet.edges[x];
}

function revertSubdivide()
{
	includeHitSolid();
	for (var k = 0; k < selectedSolids.length; k++)
	{
		if (selectedSolids[k].previousFacetLists.length > 0)
		{
			selectedSolids[k].nSubdivide = 0;
			selectedSolids[k].facets = selectedSolids[k].previousFacetLists.pop();
		}
	}
	
	sortFacets();
	
	draw();
}

function freezeSubdivide()
{
	includeHitSolid();
	for (var k = 0; k < selectedSolids.length; k++)
	{
		if (selectedSolids[k].previousFacetLists.length > 0)
		{
			selectedSolids[k].nSubdivide = 0;
			selectedSolids[k].previousFacetLists = [];
		}
	}
	
	sortFacets();
	
	draw();
}

function knitFacets(vertexList)
{
	if (vertexList.length == 8) // connect 8 facets
	{
		cloneModel();
	
		var c = getVertexCube(vertexList[0]);
		
		for (var i = 4; i < 8; i++)
		{
			var list = [];
			
			list.push(vertexList[i]);
			
			var moveAmount = new Point3D(vertexList[i - 4].x - vertexList[i].x, 
										 vertexList[i - 4].y - vertexList[i].y, 
										 vertexList[i - 4].z - vertexList[i].z);
			
			moveVertexes(c, moveAmount, list);
			updateModel();
		}
		
		sortFacets();
		
		draw();
	}
	
	else if (vertexList.length == 4) // create new facet
	{
		cloneModel();
	
		var c = getVertexCube(vertexList[0]);

		var newFacet = new Facet();
		newFacet.points.push(clonePoint3D(vertexList[0]));
		newFacet.points.push(clonePoint3D(vertexList[1]));
		newFacet.points.push(clonePoint3D(vertexList[2]));
		newFacet.points.push(clonePoint3D(vertexList[3]));
		
		c.facets.push(newFacet);
		newFacet.cube = c;
		
		updateCube(c);
			
		sortFacets();
		
		draw();
	}

	else
	{
		alertUser("Please select 4 or 8 vertices.");
	}
}

function includeHitSolid()
{
	if (hitSolid != -1 && !listHas(selectedSolids, hitSolid))
	{
		selectedSolids.push(hitSolid);
	}
}

function unify()
{
	includeHitSolid();

	if (selectedSolids.length == 0 && cubes.length == 1)
	{
		selectedSolids.push(cubes[0]);
	}
	
	correctFacetDirection(selectedSolids[0]);
}

function subdivide()
{
	includeHitSolid();

	// if only one solid, do that one
	if (selectedSolids.length == 0 && cubes.length == 1)
	{
		selectedSolids.push(cubes[0]);
	}
	
	if (selectedSolids.length != 1) // can only do one at a time
	{
		alertUser("Please select a single solid");
		return;
	}
	
	if (selectedSolids.length > 0)
	{	
		if (selectedSolids[0].facets.length < 4000)
		{
			startSubdivision(selectedSolids[0]);
		}
		else
		{
			alertUser("Too many facets. Limit is 4000");
		}
	}
	return;

	for (var k = 0; k < selectedSolids.length; k++)
	{
		var selectedSolid = selectedSolids[k];
		if (selectedSolid.facets.length < 3000)
		{		
			if (selectedSolid.nSubdivide == 0)
			{
				selectedSolid.previousFacetLists.push(selectedSolid.facets);
			}
			
			selectedSolid.nSubdivide++;
			
			selectedSolid.facets = subdivisionSurface(selectedSolid.facets, selectedSolid);
			
			fuseFaster(selectedSolid);
			
			selectedFacets = [];
			selectedLines = [];
			selectedVertexes = [];

			sortFacets();
			
			draw();
			
			setFacetCount(selectedSolid);
		}
	}
	
	reloadSceneGL();
}

function facetNeighborsPlusFacet(facet)
{
	var result = [];

	for (var i = 0; i < facet.neighbors.length; i++)
	{
		result.push(facet.neighbors[i]);
	}

	result.push(facet);

	return result;
}

function calculateVertexNormal(point, facets)
{
	var neighbors;
	
	if (fastVertexNormalMethod)
	{
		neighbors = point.neighborFacets;
	}
	else
	{
		neighbors = findFacetsTouchingPoint(point, facets);
	}
	
	var totalX = 0.0;
	var totalY = 0.0;
	var totalZ = 0.0;
	
	for (var i = 0; i < neighbors.length; i++)
	{
		var f = neighbors[i];
		
		if (f.normal == -1)
		{
			f.normal = CalculateNormal(f);			
		}
		
		totalX += f.normal.end.x - f.normal.start.x;
		totalY += f.normal.end.y - f.normal.start.y;
		totalZ += f.normal.end.z - f.normal.start.z;
	}
	
	totalX /= neighbors.length;
	totalY /= neighbors.length;
	totalZ /= neighbors.length;
	
	var l = new line(clonePoint3D(point), new Point3D(point.x + totalX, point.y + totalY, point.z + totalZ));
	
	return l;
}

function findFacetsTouchingPoint(point, facets)
{
	var result = [];

	for (var i = 0; i < facets.length; i++)
	{
		var f = facets[i];
		
		for (var j = 0; j < f.points.length; j++)
		{
			var p = f.points[j];
			
			if (pointSameAs(p, point))
			{
				if (!listHas(result, f))
				{
					result.push(f);
					break;
				}
			}
		}
	}

	return result;
}
		
function findEdgesTouchingPoint(point, facets)
{
	var result = [];

	for (var i = 0; i < facets.length; i++)
	{
		var f = facets[i];
		
		for (var j = 0; j < f.edges.length; j++)
		{
			var edge = f.edges[j];

			if (pointSameAs(edge.start, point) || pointSameAs(edge.end, point))
			{					
				var found = false;
				
				for (var n = 0; n < result.length; n++)
				{
					var l = result[n];

					if (lineSameAs(l, edge))
					{
						found = true;
					}
				}

				if (!found)
				{
					if (!listHas(result, edge))
					{
						result.push(edge);
					}
				}
			}
		}
	}

	return result;
}

function lineIsOnBorder(line)
{
	if (line.adjacentFacet == -1)
	{
		return true;
	}

	return false;
}

function multiplyPoints(p1, p2)
{
	return new Point3D(p1.x * p2.x, p1.y * p2.y, p1.z * p2.z);
}

function roundPoint(p1)
{
	p1.x = Math.round(p1.x, 3);
	p1.y = Math.round(p1.y, 3);
	p1.z = Math.round(p1.z, 3);
	
	return p1;
}

function timesPoint(p, n)
{
	return new Point3D(p.x * n, p.y * n, p.z * n);
}

function divPoint(p, n)
{
	return new Point3D(p.x / n, p.y / n, p.z / n);
}

function plusPoints(p1, p2)
{
	return new Point3D(p1.x + p2.x,	p1.y + p2.y, p1.z + p2.z);
}

function minusPoints(p1, p2)
{
	return new Point3D(p1.x - p2.x, p1.y - p2.y, p1.z - p2.z);
}

function reflectSolid()
{
	hideInputForm();
	includeHitSolid();
	var plane = getInputValue();

	var mirror;
	
	if (plane == "x" || plane == "X")
	{
		mirror = new Point3D(-1, 1, 1);
	}
	else if (plane == "y" || plane == "Y")
	{
		mirror = new Point3D(1, -1, 1)
	}
	else if (plane == "z" || plane == "Z")
	{
		mirror = new Point3D(1, 1, -1)
	}
	else
	{
		return;
	}
	
	if (selectedSolids.length > 0)
	{
		selectedSolids[0].previousFacetLists.push(selectedSolids[0].facets);
		selectedSolids[0].facets = reflectionSurface(selectedSolids[0].facets, mirror);
		updateModel();
	}
}

function moreOnRight(facets, axis)
{
	var N = 0;
	var N2 = 0;
	
	for (var i = 0; i < facets.length; i++)
	{
		var f = facets[i];
		
		if (axis.y == -1)
		{
			N += nPointsOnBottom(f, 1);
			N2 += nPointsOnBottom(f, -1);
		}
		else if (axis.z == -1)
		{
			N += nPointsOnFront(f, 1);
			N2 += nPointsOnFront(f, -1);
		}
		else
		{
			N += nPointsOnRight(f, 1);
			N2 += nPointsOnRight(f, -1);
		}
	}
	
	return (N > N2);
}

function reflectionSurface(facets, axis)
{
	var result = [];
	
	var length = facets.length;

	var opposite = -1;
	
	if (moreOnRight(facets, axis))
	{
		opposite = 1;
	}
	
	for (var i = 0; i < length; i++)
	{
		var f = facets[i];
		
		var N = 0;
		if (axis.y == -1)
		{
			N = nPointsOnBottom(f, opposite);
		}
		else if (axis.z == -1)
		{
			N = nPointsOnFront(f, opposite);
		}
		else
		{
			N = nPointsOnRight(f, opposite);
		}
		
		if (N == 4)
		{		
			var f1 = cloneFacet(f, true, axis);
		
			result.push(f);
		
			result.push(f1);
		}
		else if (N == 2)
		{
			var f1 = cloneFacet(f);
			
			f1.points = [];
			
			for (var q = 0; q < f.points.length; q++)
			{
				var p = f.points[q];
				
				if (axis.x == -1)
				{
					if (p.x * opposite > 0)
					{
						f1.points.push(clonePoint3D(p));
					}
				}
				else if (axis.y == -1)
				{
					if (p.y * opposite > 0)
					{
						f1.points.push(clonePoint3D(p));
					}
				}
				else if (axis.z == -1)
				{
					if (p.z * opposite > 0)
					{
						f1.points.push(clonePoint3D(p));
					}
				}
			}
			for (var q = f.points.length - 1; q >= 0; q--)
			{
				var p = f.points[q];
				
				if (axis.x == -1)
				{
					if (p.x * opposite > 0)
					{
						var p1 = clonePoint3D(p);
						p1.x *= -1;
						f1.points.push(p1);
					}
				}
				else if (axis.y == -1)
				{
					if (p.y * opposite > 0)
					{
						var p1 = clonePoint3D(p);
						p1.y *= -1;
						f1.points.push(p1);
					}
				}
				if (axis.z == -1)
				{
					if (p.z * opposite > 0)
					{
						var p1 = clonePoint3D(p);
						p1.z *= -1;
						f1.points.push(p1);
					}
				}
			}
			
			result.push(f1);
		}
	}
	
	return result;
}

function nPointsOnRight(facet, opposite)
{
	var count = 0;
	
	for (var h = 0; h < facet.points.length; h++)
	{
		if (facet.points[h].x * opposite > 0)
		{
			count++;
		}
	}
	
	return count;
}

function nPointsOnBottom(facet, opposite)
{
	var count = 0;
	
	for (var h = 0; h < facet.points.length; h++)
	{
		if (facet.points[h].y * opposite > 0)
		{
			count++;
		}
	}
	
	return count;
}

function nPointsOnFront(facet, opposite)
{
	var count = 0;
	
	for (var h = 0; h < facet.points.length; h++)
	{
		if (facet.points[h].z * opposite > 0)
		{
			count++;
		}
	}
	
	return count;
}

function startSubdivision(solid)
{
	informUser("Subdividing, please wait...");
	subdivSurfaceLoopCounter = 0;
	var facets = solid.facets;
	solidToSubdivide = solid;
	isSubdividing = true;

	if (solid.nSubdivide == 0)
	{
		solid.previousFacetLists.push(solid.facets);
	}
	
	for (var i = 0; i < facets.length; i++)
	{
		facets[i].edges = getFacetLines(facets[i]);
		facets[i].averagePoint3D = averageFacetPoint(facets[i].points);
	}
	
	findFacetNeighborsAndAdjacents(facets);
	
	for (var i = 0; i < facets.length; i++)
	{
		var facet = facets[i];
		
		for (var j = 0; j < facet.edges.length; j++)
		{
			var edge = facet.edges[j];
			
			var list = [];

			list.push(edge.start);
			list.push(edge.end);

			if (edge.parentFacet != -1 && edge.adjacentFacet != -1)
			{
				list.push(edge.parentFacet.averagePoint3D);
				list.push(edge.adjacentFacet.averagePoint3D);
			}

			edge.edgePoint = averageFacetPoint(list);
		}
	}
	
	subdivTimerId = setTimeout(subdivisionSurfaceProcessFacet, 0);
	
	newSubdivFacets = [];
}	

function subdivisionSurfaceProcessFacet()
{
	var facet = solidToSubdivide.facets[subdivSurfaceLoopCounter];
	var nEdge = 0;

	var neighborsAndCorners = facetNeighborsPlusFacet(facet);

	for (var j = 0; j < facet.points.length; j++)
	{
		var p = facet.points[j];
	
		var facepoints = [];
		var edgepoints = [];

		var facetsTouchingPoint = findFacetsTouchingPoint(p, neighborsAndCorners);

		for (var n = 0; n < facetsTouchingPoint.length; n++)
		{
			var f = facetsTouchingPoint[n];
			
			facepoints.push(averageFacetPoint(f.points));
		}

		var edgesTouchingPoint = findEdgesTouchingPoint(p, facetsTouchingPoint);

		for (var m = 0; m < edgesTouchingPoint.length; m++)
		{
			var l = edgesTouchingPoint[m];
			
			edgepoints.push(midPoint3D(l.start, l.end));
		}

		var onBorder = false;
		if (facepoints.length != edgepoints.length)
		{				
			onBorder = true; // vertex is on a border
		}

		var F = averageFacetPoint(facepoints);
		var R = averageFacetPoint(edgepoints);

		var n = facepoints.length;
		
		var barycenter = roundPoint(divPoint(plusPoints(plusPoints(F, timesPoint(R, 2)), timesPoint(p, n - 3)), n));

		var n1 = nEdge;

		if (n1 > facet.edges.length - 1)
		{
			n1 = 0;
		}

		var n2 = n1 - 1;

		if (n2 < 0)
		{
			n2 = facet.edges.length - 1;
		}

		if (onBorder)
		{
			var borderAverage = [];
			
			var etp = edgesTouchingPoint;
			
			for (var q = 0; q < etp.length; q++)
			{
				var l = etp[q];
				
				if (lineIsOnBorder(l))
				{
					borderAverage.push(midPoint3D(l.start, l.end));
				}
			}
			
			borderAverage.push(clonePoint3D(p));
			
			barycenter = averageFacetPoint(borderAverage);
		}

		var newFacet = new Facet();
		newFacet.points.push(clonePoint3D(facet.edges[n2].edgePoint));
		newFacet.points.push(clonePoint3D(barycenter));
		newFacet.points.push(clonePoint3D(facet.edges[n1].edgePoint));
		newFacet.points.push(clonePoint3D(facet.averagePoint3D));									 

		newSubdivFacets.push(newFacet);
		newFacet.cube = solidToSubdivide;

		nEdge++;						
	}		

	drawThermometer(solidToSubdivide.facets.length, subdivSurfaceLoopCounter);
	subdivSurfaceLoopCounter++;
	if (subdivSurfaceLoopCounter >= solidToSubdivide.facets.length)
	{
		clearInterval(subdivTimerId);
		finishSubdivision(solidToSubdivide);
	}
	else
	{
		subdivTimerId = setTimeout(subdivisionSurfaceProcessFacet, 0);
	}
}

function finishSubdivision(parentShape)
{
	parentShape.nSubdivide++;

	parentShape.facets = newSubdivFacets;

	fuseFaster(parentShape);
	
	selectedFacets = [];
	selectedLines = [];
	selectedVertexes = [];

	sortFacets();
	
	setFacetCount(parentShape);

	isSubdividing = false;
	
	alertUser("");
	
	reloadSceneGL();
	
	draw();
}

function processopenModelResult()
{
	selectedSolids = [];

	var src = modelSource;

	var nextI = { value: 0 }; // container to allow modify ref parameter

	var firstCubeIndex = getModelIndex(src, "c");
	if (firstCubeIndex > 0)
	{	
		var attributes = src.substring(0, firstCubeIndex);
		
		var r = getModelValue(attributes, "r", nextI);
		var g = getModelValue(attributes, "g", nextI);
		var b = getModelValue(attributes, "b", nextI);
		
		if (r != null && r.length > 0 && g != null && g.length > 0 && b != null && b.length > 0)
		{
			canvasBackgroundColor = new Color(Math.round(r), Math.round(g), Math.round(b));
			canvas.style.backgroundColor = colorString(canvasBackgroundColor, false);
		}
	}
	
	var newCubes = [];
	
	var cubeString = getModelValue(src, "c", nextI);
	
	var N = 0;
	while (src.length > 0 && cubeString.length > 0 && N++ < 10000)
	{	
		var c = cubeFromString(cubeString);
	
		newCubes.push(c);
	
		if (nextI.value < src.length)
		{
			src = src.substring(nextI.value);
		}
		else
		{
			src = "";
		}
		
		cubeString = getModelValue(src, "c", nextI);
	}
	
	cubes = newCubes;
	
	updateModel();
	
	draw();
	
	informUser("");
}

function openModel()
{
	doGetTitles();
	alertUser("");
	showOpenForm();
}

function deleteModel()
{
	doGetTitles();
	alertUser("");
	showDeleteForm();
}

function doOpenModel()
{
	hideInputForm();

	filename = getInputValue();

	if (filename.length > 3)
	{	
		clearUndoRecord();
	
		informUser("Opening model, please wait...");
		
		webServiceResultTag = "OpenModelResult";
		var soap = createSoapHeaderOpenModel("1", "subsurf" + filename);			
		callWebService(webServiceUrlName, soap, openModelCallComplete);
	}
	else
	{
		alertUser("Name must be longer than three characters.");
	}
}

function doDeleteModel()
{
	hideInputForm();

	filename = getInputValue();

	if (filename.length > 3)
	{	
		informUser("Deleting model, please wait...");
		
		webServiceResultTag = "DeleteModelResult";
		var soap = createSoapHeaderDeleteModel("1", "subsurf" + filename);			
		callWebService(webServiceUrlName, soap, deleteModelCallComplete);
	}
	else
	{
		alertUser("Name must be longer than three characters.");
	}
}

function doChooseTexture()
{
	hideInputForm();

	var textureName = getInputValue();
	
	selectedSolids[0].textureName = textureName;

	reloadSceneGL();	
	
	draw();
}

function doChooseFacetTexture()
{
	hideInputForm();

	var textureName = getInputValue();
	
	assignRegionUV(selectedFacets, textureName, getXTextureValue(), getYTextureValue());
	
	reloadSceneGL();
}

function titleSelected()
{
	setInputValue(getSelectedValue());
}

function setShaderFlags()
{
	var shader = getSelectedShader();

	isPhong = (shader == "Phong");
	isComic = (shader == "Comic");
	isComic2 = (shader == "Comic 2");
	isTopo = (shader == "Topo");
	isPBN = (shader == "Paint By Numbers");
	isHeatMap = (shader == "T-Map");
	isRainbow = (shader == "Rainbow 1");
	isRainbow2 = (shader == "Rainbow 2");
	isStripes = (shader == "Stripes");
	isChrome = (shader == "Chrome");
	isSmear = (shader == "Smear");
}

function shaderSelected()
{
	var wasSmooth = isSmoothShading();
	var wasTexture = needsTexture();
	
	setShaderFlags();	

	if ((isSmoothShading() != wasSmooth) || (needsTexture() != wasTexture))
	{
		rebuildGL()
	}
	else
	{
		initShaders();
	}
		
	draw();
}

function doGetTitles()
{
	webServiceResultTag = "GetModelTitlesResult";
	var soap = createSoapHeaderGetModelTitles("1");			
	callWebService(webServiceUrlName, soap, getTitlesCallComplete);
}

function doCancelForm()
{
	hideInputForm();
}

function doCancelGenericForm()
{
	hideInputForm("genericPopup");
}

function saveModel()
{
	alertUser("");
	showSaveForm();
}

function inputModel()
{
	alertUser("");
	showInputModelForm();
}

function doInputModel()
{
	hideInputForm();
	
	modelSource = getInputValue();

	if (modelSource.length > 25)
	{	
		stopTumble();
		processopenModelResult();
	}
	else
	{
		alertUser("Please enter model source");
	}
}

function doSaveModel()
{
	hideInputForm();
	
	filename = getInputValue();

	if (filename.length > 3)
	{	
		modelSource = getSource();	

		webServiceResultTag = "SaveModelResult";

		var soap = createSoapHeaderSaveModel("1", "subsurf" + filename, modelSource);
			
		callWebService(webServiceUrlName, soap, saveModelCallComplete);
	}
	else
	{
		alertUser("Name mst be longer than 3 characters");
	}
}


function varyExtrudeProperty(valueString, nSegments, iSegment, continuous)
{
	var result = 3000.0;
	
	var tokens = valueString.split(" ");
	
	var values = [];
	
	for (var t = 0; t < tokens.length; t++)
	{
		var tok = tokens[t];
		
		if (tok == "c") // continuous
		{
			continuous = true;
		}
		else if (tok == "s")
		{
			continuous = false; // stepped
		}
		else
		{
			values.push(tok); // a number
		}
	}
	
	if (iSegment == 0 || values.length == 1)
	{
		return Number(values[0]);
	}
	else if (iSegment == nSegments - 1)
	{
		return Number(values[values.length - 1]);
	}
	else
	{	
		var segmentStep = 1.0 / Number(nSegments);
		var valueStep = 1.0 / Number(values.length - 1);
		
		for (var i = 1; i < values.length; i++)
		{		
			var valueBeginMark = Number(i - 1) * valueStep;
			var valueEndMark = Number(i) * valueStep;
			
			var segmentBeginMark = Number(iSegment) * segmentStep;
			var segmentEndMark = Number(iSegment + 1) * segmentStep;
			
			if (continuous == false)
			{
				if (segmentBeginMark >= valueBeginMark)
				{
					result = Number(values[i]);
				}
			}
			else
			{
				if (segmentEndMark >= valueEndMark)
				{
					result = Number(values[i]);
				}
				else if (segmentEndMark > valueBeginMark && segmentEndMark < valueEndMark)
				{
					var distance = valueEndMark - valueBeginMark;
					var partialDistance = segmentEndMark - valueBeginMark;
					var rate = partialDistance / distance;
					var amt = Number(values[i]) - Number(values[i - 1]);
					result = Number(values[i - 1]) + (amt * rate);
				}
			}
		}
		
		return result;
	}
	
	return result;
}


function pointFromString(src)
{
	var pts = src.split(" ");
	
	if (pts.length == 3)
	{
		var p = new Point3D(Number(pts[0]), Number(pts[1]), Number(pts[2]));
		return p;
	}
	
	else if (pts.length == 5)
	{
		var p = new Point3D(Number(pts[0]), Number(pts[1]), Number(pts[2]));
		p.U = Number(pts[3]);
		p.V = Number(pts[4]);
		return p;
	}
	
	return null;
}

function facetFromString(src)
{
	var facet = new Facet();

	var nextI = { value: 0 }; // container to allow modify ref parameter
	
	var pointString = getPointValue(src, nextI);
	
	var N = 0;
	while (src.length > 0 && pointString.length > 0 && N++ < 10000)
	{	
		var p = pointFromString(pointString);
		
		if (p != null)
		{
			facet.points.push(p);
		}
	
		if (nextI.value < src.length)
		{
			src = src.substring(nextI.value);
		}
		else
		{
			src = "";
		}
		
		pointString = getPointValue(src, nextI);
	}
	
	return facet;
}

function cubeFromString(src)
{
	var c = new cube(0, 0, 0, 0, 0, 0);

	c.facets = [];
	
	var nextI = { value: 0 }; // container to allow modify ref parameter
	
	var r = getModelValue(src, "r", nextI);
	var g = getModelValue(src, "g", nextI);
	var b = getModelValue(src, "b", nextI);
	
	if (
		r != null && r.length > 0 &&
		g != null && g.length > 0 &&
		b != null && b.length > 0
		)
	{
		c.color = new Color(Math.round(r), Math.round(g), Math.round(b));
		src = src.substring(nextI.value);
	}

	c.textureName = getModelValue(src, "tx", nextI);
	
	var or = getModelValue(src, "or", nextI);
	var og = getModelValue(src, "og", nextI);
	var ob = getModelValue(src, "ob", nextI);
	
	if (
		or != null && or.length > 0 &&
		og != null && og.length > 0 &&
		ob != null && ob.length > 0
		)
	{
		c.outlineColor = new Color(Math.round(or), Math.round(og), Math.round(ob));
		src = src.substring(nextI.value);
	}


	var nSub = getModelValue(src, "ns", nextI); // n subdivisions
	if (nSub != null && nSub.length > 0)
	{
		// todo: carry out subdivisions and set previousFacets to base...
	}
	
	var facetString = getModelValue(src, "f", nextI);
	
	var N = 0;
	while (src.length > 0 && facetString.length > 0 && N++ < 20000)
	{			
		var f = facetFromString(facetString);
	
		if (f != null)
		{
			c.facets.push(f);
			f.cube = c;
		}
	
		if (nextI.value < src.length)
		{
			src = src.substring(nextI.value);
		}
		else
		{
			src = "";
		}
		
		facetString = getModelValue(src, "f", nextI);
	}
	
	return c;
}

function saveModelCallComplete(result, data)
{
	if (result)
	{
		var msg = getTagValue(data, webServiceResultTag);
		if (msg == "OK")
		{
			informUser("Model was saved");
		}
		else
		{
			alertUser("Save model: " + msg);
		}
	}
	else
	{
		alertUser("Error occurred calling web service.");
	}
}

function openModelCallComplete(result, data)
{
	if (result)
	{
		var s = getTagValue(data, webServiceResultTag);
		if (s.length < 100)
		{
			alertUser("Open Model: " + s);
		}
		else
		{
			modelSource = s;
			processopenModelResult();
		}
	}
	else
	{
		alertUser("Error occurred calling web service.");
	}
}

function deleteModelCallComplete(result, data)
{
	if (result)
	{
		var s = getTagValue(data, webServiceResultTag);
		if (s != "ok")
		{
			alertUser("Delete Model: " + s);
		}
		else
		{
			informUser("Model was deleted");
		}
	}
	else
	{
		alertUser("Error occurred calling web service.");
	}
}

function findFacetTiltToOrtho(facet, orientation)
{
	if (orientation == "z")
	{
		var centerX = new Point(facet.normal.start.z, facet.normal.start.x);
		var centerY = new Point(facet.normal.start.z, facet.normal.start.y);

		var endFlatX = new Point(facet.normal.end.z, facet.normal.start.x);
		var endFlatY = new Point(facet.normal.end.z, facet.normal.start.y);
		
		var endX = new Point(facet.normal.end.z, facet.normal.end.x);
		var endY = new Point(facet.normal.end.z, facet.normal.end.y);

		var x_angle = degrees_from_radians(RadiansFromRotationPoint(endX, centerX));
		var y_angle = degrees_from_radians(RadiansFromRotationPoint(endY, centerY));
		var x_angleFlat = degrees_from_radians(RadiansFromRotationPoint(endFlatX, centerX));
		var y_angleFlat = degrees_from_radians(RadiansFromRotationPoint(endFlatY, centerY));
		
		var movex = x_angleFlat - x_angle;
		var movey = y_angleFlat - y_angle;
		
		informUser(" " + Math.round(movex) + " " + Math.round(movey));

		return new Point(movex, movey);
	}
	else if (orientation == "x")
	{
		var centerY = new Point(facet.normal.start.x, facet.normal.start.y);
		var centerZ = new Point(facet.normal.start.x, facet.normal.start.z);

		var endFlatY = new Point(facet.normal.end.x, facet.normal.start.y);
		var endFlatZ = new Point(facet.normal.end.x, facet.normal.start.z);
		
		var endY = new Point(facet.normal.end.x, facet.normal.end.y);
		var endZ = new Point(facet.normal.end.x, facet.normal.end.z);

		var z_angle = degrees_from_radians(RadiansFromRotationPoint(endZ, centerZ));
		var y_angle = degrees_from_radians(RadiansFromRotationPoint(endY, centerY));
		var z_angleFlat = degrees_from_radians(RadiansFromRotationPoint(endFlatZ, centerZ));
		var y_angleFlat = degrees_from_radians(RadiansFromRotationPoint(endFlatY, centerY));
		
		var movez = normalize180(z_angleFlat - z_angle);
		var movey = normalize180(y_angleFlat - y_angle);
		
		informUser(" " + Math.round(movez) + " " + Math.round(movey));

		return new Point(movey, movez);
	}
	if (orientation == "y")
	{
		var centerX = new Point(facet.normal.start.y, facet.normal.start.x);
		var centerZ = new Point(facet.normal.start.y, facet.normal.start.z);

		var endFlatX = new Point(facet.normal.end.y, facet.normal.start.x);
		var endFlatZ = new Point(facet.normal.end.y, facet.normal.start.z);
		
		var endX = new Point(facet.normal.end.y, facet.normal.end.x);
		var endZ = new Point(facet.normal.end.y, facet.normal.end.z);

		var x_angle = degrees_from_radians(RadiansFromRotationPoint(endX, centerX));
		var z_angle = degrees_from_radians(RadiansFromRotationPoint(endZ, centerZ));
		var x_angleFlat = degrees_from_radians(RadiansFromRotationPoint(endFlatX, centerX));
		var z_angleFlat = degrees_from_radians(RadiansFromRotationPoint(endFlatZ, centerZ));
		
		var movex = normalize180(x_angleFlat - x_angle);
		var movez = normalize180(z_angleFlat - z_angle);
		
		informUser(" " + Math.round(movex) + " " + Math.round(movez));

		return new Point(movex, movez);
	}
}

function replaceAll(s, t, t1)
{
	var s1;
	
	while (true)
	{
		var s1 = s.replace(t, t1);
		if (s1 == s)
		{
			break;
		}		
		s = s1;
	}
	
	return s1;
}

function removeOptions(selectbox)
{
    var i;
    for(i = selectbox.options.length - 1 ; i >= 0 ; i--)
    {
        selectbox.remove(i);
    }
}

function getTitlesCallComplete(result, data)
{
	removeOptions(document.getElementById("picklist"));

	if (result)
	{
		var s = getTagValue(data, webServiceResultTag);
		
		s = replaceAll(s, "<string>", "");
		s = replaceAll(s, "</string>", "|");
		
		var titles = [];
		
		while (s.length > 0)
		{
			var index = s.indexOf("|", 0);
			
			if (index > 0)
			{			
				var title = s.substring(0, index);
				title = title.replace("subsurf", "");
				titles.push(title);
				s = s.substring(index + 1);				
			}
			else
			{
				break;
			}			
		}
		
		titles.sort();
		
		addTitleToList("");
		for (var i = 0; i < titles.length; i++)
		{
			addTitleToList(titles[i]);
		}
	}
	else
	{
		alertUser("Error occurred calling web service.");
	}	
}

function hideElement(name)
{
	var elem = document.getElementById(name);
	elem.style.display = 'none';
}

function showElement(name)
{
	var elem = document.getElementById(name);
	elem.style.display = 'inline';
}

function addTitleToList(title) 
{
    var x = document.getElementById("picklist");
    var option = document.createElement("option");
    option.text = title;
    x.add(option);
}

function addShaderToList(title) 
{
    var x = document.getElementById("picklistShader");
    var option = document.createElement("option");
    option.text = title;
    x.add(option);
}

function clearList() 
{
    var x = document.getElementById("picklist");
    x.options.length = 0;
}

function getModelIndex(inputStr, tagName)
{
	var stag = "{" + tagName + "}";
	var startPos = inputStr.indexOf(stag, 0);
	return startPos;
}

function getModelValue(inputStr, tagName, nextIndex)
{
	var stag = "{" + tagName + "}";
	var etag = "{/" + tagName + "}";

	var startPos = inputStr.indexOf(stag, 0);
	if (startPos >= 0)
	{
		var endPos = inputStr.indexOf(etag, startPos);
		if (endPos > startPos)
		{
			startPos = startPos + stag.length;
			nextIndex.value = endPos + etag.length;
			return inputStr.substring(startPos, endPos);
		}
	}

	return "";
}

function getPointValue(inputStr, nextIndex)
{
	var etag = "|";

	var startPos = 0;
	var endPos = inputStr.indexOf(etag, startPos);
	if (endPos > startPos)
	{
		nextIndex.value = endPos + etag.length;
		return inputStr.substring(startPos, endPos);
	}

	return "";
}

function getTagValue(inputStr, tagName)
{
	var stag = "<" + tagName + ">";
	var etag = "</" + tagName + ">";

	var startPos = inputStr.indexOf(stag, 0);
	if (startPos >= 0)
	{
		var endPos = inputStr.indexOf(etag, startPos);
		if (endPos > startPos)
		{
			startPos = startPos + stag.length;
			return inputStr.substring(startPos, endPos);
		}
	}

	return "";
}

function callWebService(url, soapXml, callback)
{
	var xmlDoc = null;

	if (window.XMLHttpRequest)
	{
		xmlDoc = new XMLHttpRequest(); //Newer browsers
	}
	else if (window.ActiveXObject) //IE 5, 6
	{
		xmlDoc = new ActiveXObject("Microsoft.XMLHTTP");
	}

	if (xmlDoc)
	{
		var self = this;
		xmlDoc.onreadystatechange = function() { StateChange(xmlDoc, callback); };

		xmlDoc.open("POST", url, true);
		xmlDoc.setRequestHeader("Content-Type", "text/xml");
		xmlDoc.setRequestHeader("Content-Length", soapXml.length);
		xmlDoc.send(soapXml);
	}
	else
	{
		if (callback)
		{
			callback(false, "unable to create XMLHttpRequest object");
		}
	}
}

function StateChange(xmlDoc, callback)
{
	if (xmlDoc.readyState === 4)
	{
		var text = "";

		if (xmlDoc.status === 200)
		{
			text = xmlDoc.responseText;
		}

		if (callback !== null)
		{
			callback(xmlDoc.status === 200, text);
		}
	}
}

function soapHeader()
{
	var soap = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
	"<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
	"xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" " +
	"xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">" +
	"<soap12:Body>";
	
	return soap;
}

function createSoapHeaderSaveModel(userid, title, content)
{
	var soap = soapHeader() +
	"<SaveModel xmlns=\"http://tempuri.org/\">" +
	"<userid>" + userid + "</userid>" +
	"<title>" + title + "</title>" +
	"<content>" + content + "</content>" +
	"</SaveModel>" +
	"</soap12:Body>" +
	"</soap12:Envelope>";        
	
	return soap;
}

function createSoapHeaderOpenModel(userid, title)
{
	var soap = soapHeader() +
	"<OpenModel xmlns=\"http://tempuri.org/\">" +
	"<userid>" + userid + "</userid>" +
	"<title>" + title + "</title>" +
	"</OpenModel>" +
	"</soap12:Body>" +
	"</soap12:Envelope>";        
	
	return soap;
}

function createSoapHeaderDeleteModel(userid, title)
{
	var soap = soapHeader() +
	"<DeleteModel xmlns=\"http://tempuri.org/\">" +
	"<userid>" + userid + "</userid>" +
	"<title>" + title + "</title>" +
	"</DeleteModel>" +
	"</soap12:Body>" +
	"</soap12:Envelope>";        
	
	return soap;
}

function createSoapHeaderGetModelTitles(userid)
{
	var soap = soapHeader() +
	"<GetModelTitles xmlns=\"http://tempuri.org/\">" +
	"<userid>" + userid + "</userid>" +
	"</GetModelTitles>" +
	"</soap12:Body>" +
	"</soap12:Envelope>";        
	
	return soap;
}

function addOptionToPicklist(id, val) 
{
    var x = document.getElementById(id);
    var option = document.createElement("option");
    option.text = val;
    x.add(option);
}

function showGenericForm(title, buttonCaption, onClickOK, controls) 
{
	alertUser("");
	hideCanvas();

	var text = "<a id = \" genericTitle \"   style=\"position:absolute;left:20px;top:20px;\">" + title + "</a>";
	
	text += "<INPUT TYPE=BUTTON ID=\"cancelGenericFormButton\" NAME=\"cancelGenericFormButton\" VALUE=\"Cancel\" ONCLICK=\"doCancelGenericForm()\"      CLASS=\"btn\" style=\"position:absolute;right:100px;bottom:20px;\">";

	text += "<INPUT TYPE=BUTTON ID=\"okGenericFormButton\" NAME=\"okGenericFormButton\" VALUE=\"" 
				+ buttonCaption + "\" ONCLICK=\"" + onClickOK + "()\" CLASS=\"btn\" style=\"position:absolute;left:100px;bottom:20px;\">";
	
	for (var t = 0; t < controls.length; t++)
	{
		var ctl = controls[t];

		if (ctl.type == "label")
		{
			text += "<a id = \"" + ctl.id + "\" style=\"position:absolute;left:" + ctl.xPosition 
					+ "px;top:" + ctl.yPosition + "px;\">" + ctl.text + "</a>";
		}
		else if (ctl.type == "text")
		{
			text += "<input id = \"" + ctl.id + "\" value=\"" + ctl.val + "\" type=\"text\" style=\"position:absolute;left:" + ctl.xPosition 
					+ "px;top:" + ctl.yPosition + "px;width:" + ctl.width + "px\">";
		}
		else if (ctl.type == "picklist")
		{
			text += "<select id = \"" + ctl.id + "\" style=\"position:absolute;left:" + ctl.xPosition 
					+ "px;top:" + ctl.yPosition + "px;width:" + ctl.width + "px\"></select>";
		}
		else if (ctl.type == "checkbox")
		{
		    text += "<div><input type=\"checkbox\" id=\"" + ctl.id + "\" style=\"position:absolute;left:" + ctl.xPosition 
					+ "px;top:" + ctl.yPosition + "px;\">";
		}
	}
	
	document.getElementById("genericForm").innerHTML = text;	
	
	document.getElementById("genericPopup").style.display = "block";
	
	for (var t = 0; t < controls.length; t++)
	{
		var ctl = controls[t];

		if (ctl.type == "picklist")
		{
			if (ctl.choices != undefined)
			{
				for (var g = 0; g < ctl.choices.length; g++)
				{
					addOptionToPicklist(ctl.id, ctl.choices[g]);
				}
			}
		}
	}	
}


function showInputForm(title, buttonCaption, defaultValue, onclick, showPicklist, label1, picklistlabel, textureX, textureY) 
{
	if (textureX == undefined)
	{
		hideElement("xpercentlabel");
		hideElement("xpercentinput");
	}
	else
	{
		showElement("xpercentlabel");
		showElement("xpercentinput");
		document.getElementById("xpercentinput").value = textureX;	
	}

	if (textureY == undefined)
	{
		hideElement("ypercentlabel");
		hideElement("ypercentinput");
	}
	else
	{
		showElement("ypercentlabel");
		showElement("ypercentinput");
		document.getElementById("ypercentinput").value = textureY;	
	}

	if (showPicklist == undefined)
	{
		showPicklist = false;
	}
	
	alertUser("");
	hideCanvas();

	if (showPicklist)
	{
		showElement("picklist");
		showElement("picklistlabel");
	}
	else
	{
		hideElement("picklist");
		showElement("picklistlabel");
	}
	
	document.getElementById("label1").innerHTML = label1;
	document.getElementById("picklistlabel").innerHTML = picklistlabel;
	
	document.getElementById("saveFormButton").onclick = onclick;
	document.getElementById("saveFormButton").value = buttonCaption;	
	document.getElementById("inputname").value = defaultValue;	
	document.getElementById('formtitle').innerHTML = title;
	document.getElementById('popupSave').style.display = "block";
}

function showSlabForm() 
{
	showInputForm("Please enter a distance", "Accept", cubeSize * 2, doSlab, false, "Distance: ", "");
}

function showBridgeForm() 
{
	showInputForm("Please enter a distance", "Accept", cubeSize * 2, doBridge, false, "Distance: ", "");
}

function showTunnelForm() 
{
	showInputForm("Please enter a distance", "Accept", cubeSize * 2, doTunnel, false, "Distance: ", "");
}

function showExtrudeForm() 
{
	showInputForm("Please enter a distance", "Accept", cubeSize * 2, doExtrudeFacets, false, "Distance: ", "");
}

function showExtrudeGroupForm() 
{
	showInputForm("Please enter a distance", "Accept", cubeSize * 2, doExtrudeGroup, false, "Distance: ", "");
}

function showIndentForm() 
{
	showInputForm("Please enter a distance", "Accept", cubeSize * 2, doIndentFacets, false, "Distance: ", "");
}

function showRaiseForm() 
{
	showInputForm("Please enter a distance", "Accept", cubeSize * 2, raiseFacetCommand, false, "Distance: ", "");
}

function showSaveForm() 
{
	showInputForm("Save", "Save", filename, doSaveModel, false, "Name: ", "");
}

function showInputModelForm() 
{
	showInputForm("Input", "Input", filename, doInputModel, false, "Source: ", "");
}

function showOpenForm() 
{
	showInputForm("Open", "Open", filename, doOpenModel, true, "Name: ", "Choose existing: ");
}

function showDeleteForm() 
{
	showInputForm("Delete", "Delete", filename, doDeleteModel, true, "Name: ", "Choose existing: ");
}

function addTextureMenuItems()
{
	clearList();
	addTitleToList("stone");
	addTitleToList("brick");
	addTitleToList("grass");
	addTitleToList("pebbles");
	addTitleToList("wood");
	addTitleToList("paisley");
	addTitleToList("sky");
	addTitleToList("steel");
}

function addAxisMenuItems()
{
	clearList();
	addTitleToList("X");
	addTitleToList("Y");
	addTitleToList("Z");
}

function showReflectForm() 
{
	setInputValue("X");
	addAxisMenuItems();
	showInputForm("Reflect", "Choose", "X", reflectSolid, true, "Axis: ", "Choose axis: ");
}

function showTextureForm() 
{
	addTextureMenuItems();
	showInputForm("Texture", "Choose", "", doChooseTexture, true, "Name: ", "Choose texture: ");
}

function showFacetTextureForm() 
{
	addTextureMenuItems();
	showInputForm("Texture", "Choose", "", doChooseFacetTexture, true, "Name: ", "Choose texture: ", 1.0, 1.0);
}

function hideInputForm(ID)
{
	if (ID == undefined)
	{
		ID = "popupSave";
	}

	if (formIsShown(ID))
	{
		document.getElementById(ID).style.display = "none";
		docSize = defaultDocSize;
		draw();
		resize();
		zoomNormal();
	}
}

function anyFormIsShown()
{
	if (formIsShown("popupSave"))
	{
		return true;
	}
	
	if (formIsShown("genericPopup"))
	{
		return true;
	}
	
	return false;
}

function formIsShown(ID)
{
	if (ID == undefined)
	{
		ID = "popupSave";
	}

	if (document.getElementById(ID).style.display == "block")
	{
		return true;
	}
	
	return false;
}

function HSLtoRGB(h, s, l)
{
	if (s == 0)
	{
		// achromatic color (gray scale)
		var L = l * 255.0;
		return new RGB(L, L, L);
	}
	else
	{
		var q = (l < 0.5) ? (l * (1.0 + s)) : (l + s - (l * s));
		var p = (2.0 * l) - q;

		var Hk = h / 360.0;
		var T = [];
		T.push(Hk + (1.0 / 3.0));
		T.push(Hk);
		T.push(Hk - (1.0 / 3.0));

		for (var i = 0; i < 3; i++)
		{
			if (T[i] < 0) 
			{
				T[i] += 1.0;
			}
			if (T[i] > 1) 
			{
				T[i] -= 1.0;
			}

			if ((T[i] * 6) < 1)
			{
				T[i] = p + ((q - p) * 6.0 * T[i]);
			}
			else if ((T[i] * 2.0) < 1) //(1.0/6.0)<=T[i] && T[i]<0.5
			{
				T[i] = q;
			}
			else if ((T[i] * 3.0) < 2) // 0.5<=T[i] && T[i]<(2.0/3.0)
			{
				T[i] = p + (q - p) * ((2.0 / 3.0) - T[i]) * 6.0;
			}
			else 
			{
				T[i] = p;
			}
		}
	}

	return new RGB(T[0] * 255.0, 
				   T[1] * 255.0, 
				   T[2] * 255.0);
}
		
function RGBtoHSL(red, green, blue)
{
	var h = 0;
	var s = 0;
	var l = 0;

	// normalize red, green, blue values
	var r = red / 255.0;
	var g = green / 255.0;
	var b = blue / 255.0;

	var max = Math.max(r, math.max(g, b));
	var min = Math.min(r, math.min(g, b));

	// hue
	if (max == min)
	{
		h = 0; // undefined
	}
	else if (max == r && g >= b)
	{
		h = 60.0 * (g - b) / (max - min);
	}
	else if (max == r && g < b)
	{
		h = 60.0 * (g - b) / (max - min) + 360.0;
	}
	else if (max == g)
	{
		h = 60.0 * (b - r) / (max - min) + 120.0;
	}
	else if (max == b)
	{
		h = 60.0 * (r - g) / (max - min) + 240.0;
	}

	// luminance
	l = (max + min) / 2.0;

	// saturation
	if (l == 0 || max == min)
	{
		s = 0;
	}
	else if (0 < l && l <= 0.5)
	{
		s = (max - min) / (max + min);
	}
	else if (l > 0.5)
	{
		s = (max - min) / (2 - (max + min)); //(max-min > 0)?
	}

	return new HSL(h, s, l);
}


///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

var zoomAmountGL = 6;
var zoomIncrementGL = 0.6;
var zoomSlideIncrementGL = 5.0;

var panXAmountGL = 0;
var panXIncrementGL = 0.01;
var panYAmountGL = 0;
var panYIncrementGL = 0.01;


var cubeVerticesNormalBuffer;
var cubeVerticesBuffer;
var cubeVerticesColorBuffer;
var cubeVerticesIndexBuffer;
var cubeVerticesTextureCoordBuffer;
var cubeRotationY = 0.0;
var cubeRotationX = 0.0;
var cubeRotationZ = 0.0;
var lastCubeUpdateTime = 0;
var xIncValue = 0.2;
var yIncValue = -0.4;
var zIncValue = 0.3;

var mvMatrix;
var shaderProgram;
var vertexPositionAttribute;
var vertexColorAttribute;
var perspectiveMatrix;

function setBackColorGL()
{
    gl.clearColor(canvasBackgroundColor.R / 255.0, canvasBackgroundColor.G / 255.0, canvasBackgroundColor.B / 255.0, 1.0);
}

function startGL() 
{
  if (gl) 
  {
	setBackColorGL();
	
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    initShaders();

	bindModelGL();

	if (needsTexture())
	{
		initTextures();
	}
	
	gl.viewport(0, 0, canvas2.width, canvas2.height);
	
    drawSceneGL();
  }
}

function needsTexture()
{
	return isTexture || isSmear || isChrome;
}

function reloadSceneGL() 
{
	if (gl != null && isGL) 
	{
		bindModelGL();
		gl.viewport(0, 0, canvas2.width, canvas2.height);
		setBackColorGL();
		drawSceneGL();
	}
}

function bindColorsGL()
{
	if (isGL && gl != null)
	{
		var generatedColors = [];
		
		for (var i = 0; i < allFacets.length; i++)
		{	
			var f = allFacets[i];

			var c = color2FromColor(f.cube.color);
			
			var b = [];
			
			if (useRandomColors1)
			{
				b.push(Math.random());
				b.push(Math.random());
				b.push(Math.random());
			}
			else
			{
				b.push(c.R);
				b.push(c.G);
				b.push(c.B);
			}
			{
				b.push(1.0);
			}
				
			// repeat each color 4 times for the 4 vertices of each facet
			for (var s = 0; s < 4; s++) 
			{			
				if (useRandomColors2)
				{
					generatedColors.push(Math.random());
					generatedColors.push(Math.random());
					generatedColors.push(Math.random());
					generatedColors.push(1.0);
				}
				else
				{
					generatedColors.push(b[0]);
					generatedColors.push(b[1]);
					generatedColors.push(b[2]);
					generatedColors.push(b[3]);				
				}
			}
		}
	  
		cubeVerticesColorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(generatedColors), gl.STATIC_DRAW);
	}
}

function eraseVertexNormals()
{
	for (q = 0; q < allFacets.length; q++) 
	{
		var f = allFacets[q];

		for (var j = 0; j < f.points.length; j++)
		{
			var p = f.points[j];
			p.vertexNormal = undefined;
		}
	}
}

function bindNormalsGL()
{			  
	if (isGL && gl != null)
	{	
		cubeVerticesNormalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesNormalBuffer);

		var vertexNormals = [];

		for (q = 0; q < allFacets.length; q++) 
		{
			var f = allFacets[q];

			if (f.normal == -1)
			{
				f.normal = CalculateNormal(f);
			}
		}

		if (fastVertexNormalMethod)
		{
			if (isSmoothShading())
			{
				allSortedPoints = getFacetPointsAndSetUpBackPointers(allFacets);
				sortPointsByXYZ(allSortedPoints);
				stageVertexNeighborFacets(allSortedPoints);
			}
		}

		if (isSmoothShading())
		{		
			for (q = 0; q < allFacets.length; q++) 
			{
				var f = allFacets[q];

				for (var j = 0; j < f.points.length; j++)
				{
					var p = f.points[j];
					var vn = p.vertexNormal;
					if (vn == undefined)
					{
						vn = calculateVertexNormal(p, allFacets);
						p.vertexNormal = vn;
					}
					vertexNormals.push((vn.end.x / reductionFactor) - (vn.start.x / reductionFactor));
					vertexNormals.push((vn.end.y / reductionFactor) - (vn.start.y / reductionFactor));
					vertexNormals.push((vn.end.z / reductionFactor) - (vn.start.z / reductionFactor));
				}
			}		
		}
		else
		{
			for (q = 0; q < allFacets.length; q++) 
			{
				var f = allFacets[q];

				for (var i = 0; i < 4; i++) 
				{
					vertexNormals.push((f.normal.end.x / reductionFactor) - (f.normal.start.x / reductionFactor));
					vertexNormals.push((f.normal.end.y / reductionFactor) - (f.normal.start.y / reductionFactor));
					vertexNormals.push((f.normal.end.z / reductionFactor) - (f.normal.start.z / reductionFactor));
				}
			}		
		}		

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
	}
}

function bindVerticesGL()
{
	cubeVerticesBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);

	var vertices = [];
  
	for (var i = 0; i < allFacets.length; i++)
	{	
		var f = allFacets[i];
		for (var j = 0; j < f.points.length; j++)
		{
			var point3d = f.points[j];
		
			vertices.push(point3d.x / reductionFactor);
			vertices.push(point3d.y / reductionFactor);
			vertices.push((point3d.z / reductionFactor));
		}
	}
  
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function bindVertexIndicesGL()
{
	cubeVerticesIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);

	var cubeVertexIndices = [];
 
	var t = 0;
	
	for (var i = 0; i < allFacets.length; i++)
	{
		cubeVertexIndices.push(t + 0);
		cubeVertexIndices.push(t + 1);
		cubeVertexIndices.push(t + 2);
		cubeVertexIndices.push(t + 0);
		cubeVertexIndices.push(t + 2);
		cubeVertexIndices.push(t + 3);
		
		t += 4;
	}

	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
}

function bindModelGL() 
{
	bindVerticesGL();
	
	bindColorsGL();

	bindVertexIndicesGL();

	bindTextureCoordinatesGL();

	bindNormalsGL();
}

function bindTextureCoordinatesGL()
{
	for (var i = 0; i < cubes.length; i++)
	{
		assignPolarUV_2(cubes[i], i);
	}

	cubeVerticesTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);
  
	var textureCoordinates = [];
	for (var i = 0; i < allFacets.length; i++)
	{
		if (isPolarUV)
		{
			var f = allFacets[i];
			
			textureCoordinates.push(f.points[0].u);  
			textureCoordinates.push(f.points[0].v);  
			
			textureCoordinates.push(f.points[1].u);  
			textureCoordinates.push(f.points[1].v);  

			textureCoordinates.push(f.points[2].u);  
			textureCoordinates.push(f.points[2].v);  

			textureCoordinates.push(f.points[3].u);  
			textureCoordinates.push(f.points[3].v);  
		}
		else
		{
			textureCoordinates.push(0.0);  
			textureCoordinates.push(0.0);
			textureCoordinates.push(1.0);  
			textureCoordinates.push(0.0);
			textureCoordinates.push(1.0);  
			textureCoordinates.push(1.0);
			textureCoordinates.push(0.0);  
			textureCoordinates.push(1.0);
		}
	}  

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
              gl.STATIC_DRAW);
}

function makePerspective(fieldOfViewInRadians, aspect, near, far) {
  var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
  var rangeInv = 1.0 / (near - far);
 
  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, near * far * rangeInv * 2, 0
  ];
};

function drawSceneGL() 
{
	if (!isGL)
	{
		return;
	}

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	perspectiveMatrix = makePerspective(fieldOfViewGL, canvas2.width / canvas2.height, 0.1, 100.0);

	loadIdentity(); // start drawing position

	mvTranslate([0, 0, -zoomAmountGL]); // zoom in or out

	mvTranslate([panXAmountGL, panYAmountGL, 0]); // user pan left/right/up/down
	
	// scene rotations
	mvPushMatrix();
	mvRotate(cubeRotationX, [1, 0, 0]);
	mvRotate(cubeRotationY, [0, 1, 0]);
	mvRotate(cubeRotationZ, [0, 0, 1]);

	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesNormalBuffer);
	gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);				

	if (needsTexture())
	{
		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);
		gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
		
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
		gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);	
	}
	else
	{
		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBuffer);
		gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
	}

	if (isSmear)
	{
		gl.uniform1i(gl.getUniformLocation(shaderProgram, "myUniform"), getTextureIndex(cubes[0].textureName));	
	}

	if (isSmoothShading())
	{		
		gl.uniform1i(gl.getUniformLocation(shaderProgram, "specularUniform"), isSpecular ? 1:0);	
	}

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, allFacets.length * 6, gl.UNSIGNED_SHORT, 0);

	mvPopMatrix(); // Restore the original matrix
}

function isSmoothShading()
{
	return isPhong || isRainbow || isStripes || isChrome || isSmear || isRainbow2 || isComic || isHeatMap || isPBN || isTopo || isComic2;
}

function initShaders() 
{
	if (isGL && gl != null)
	{
		var fragmentShader;
		var vertexShader;

		if (isRainbow)
		{
			fragmentShader = getShader(gl, "shader-fs-normals-notexture-rainbow");
			vertexShader = getShader(gl, "shader-vs-normals-notexture-rainbow");		
		}
		else if (isStripes)
		{
			fragmentShader = getShader(gl, "shader-fs-normals-notexture-stripes");
			vertexShader = getShader(gl, "shader-vs-normals-notexture-stripes");		
		}
		else if (isChrome)
		{
			fragmentShader = getShader(gl, "shader-fs-normals-texture-chrome-phong");
			vertexShader = getShader(gl, "shader-vs-normals-texture-chrome-phong");		
		}
		else if (isSmear)
		{
			fragmentShader = getShader(gl, "shader-fs-normals-texture-smear-phong");
			vertexShader = getShader(gl, "shader-vs-normals-texture-smear-phong");		
		}
		else if (isRainbow2)
		{
			fragmentShader = getShader(gl, "shader-fs-normals-notexture-rainbow2");
			vertexShader = getShader(gl, "shader-vs-normals-notexture-rainbow2");		
		}
		else if (isPhong)
		{
			if (isTexture)
			{
				fragmentShader = getShader(gl, "shader-fs-normals-texture-phong");
				vertexShader = getShader(gl, "shader-vs-normals-texture-phong");		
			}
			else
			{
				fragmentShader = getShader(gl, "shader-fs-normals-notexture-phong");
				vertexShader = getShader(gl, "shader-vs-normals-notexture-phong");		
			}
		}
		else if (isHeatMap)
		{
			fragmentShader = getShader(gl, "shader-fragment-heatmap");
			vertexShader = getShader(gl, "shader-vertex-heatmap");		
		}
		else if (isComic)
		{
			fragmentShader = getShader(gl, "shader-fragment-outlines");
			vertexShader = getShader(gl, "shader-vertex-outlines");		
		}
		else if (isComic2)
		{
			fragmentShader = getShader(gl, "shader-fragment-outlines-noshade");
			vertexShader = getShader(gl, "shader-vertex-outlines-noshade");		
		}
		else if (isTopo)
		{
			fragmentShader = getShader(gl, "shader-fragment-topo");
			vertexShader = getShader(gl, "shader-vertex-topo");		
		}
		else if (isPBN)
		{
			fragmentShader = getShader(gl, "shader-fragment-pbn");
			vertexShader = getShader(gl, "shader-vertex-pbn");		
		}
		else
		{
			if (isTexture)
			{
				fragmentShader = getShader(gl, "fragment-shader-texture-flat");
				vertexShader = getShader(gl, "vertex-shader-texture-flat");		
			}	
			else
			{
				fragmentShader = getShader(gl, "fragment-shader-color-flat");
				vertexShader = getShader(gl, "vertex-shader-color-flat");		
			}	
		}
	  
		shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);

		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) 
		{
			alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shader));
		}

		gl.useProgram(shaderProgram);

		vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
		gl.enableVertexAttribArray(vertexPositionAttribute);

		if (needsTexture())
		{
			textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
			gl.enableVertexAttribArray(textureCoordAttribute);
		}
		else
		{
			vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
			gl.enableVertexAttribArray(vertexColorAttribute);
		}

		vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
		gl.enableVertexAttribArray(vertexNormalAttribute);
	}
}

function getShader(gl, id) 
{
	var shaderScript = document.getElementById(id);

	if (!shaderScript) 
	{
		return null;
	}

	var theSource = "";
	var currentChild = shaderScript.firstChild;

	while(currentChild) 
	{
		if (currentChild.nodeType == 3) 
		{
			theSource += currentChild.textContent;
		}

		currentChild = currentChild.nextSibling;
	}

	var shader;

	if (shaderScript.type == "x-shader/x-fragment") 
	{
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} 
	else if (shaderScript.type == "x-shader/x-vertex") 
	{
		shader = gl.createShader(gl.VERTEX_SHADER);
	} 
	else 
	{
		return null;
	}

	gl.shaderSource(shader, theSource);

	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) 
	{
		alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

//
// Matrix utility functions
//

function loadIdentity() {
  mvMatrix = Matrix.I(4);
}

function multMatrix(m) {
  mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v) {
  multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

function setMatrixUniforms() {
  var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

  var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
  
	var normalMatrix = mvMatrix.inverse();
	normalMatrix = normalMatrix.transpose();
	var nUniform = gl.getUniformLocation(shaderProgram, "uNormalMatrix");		
	gl.uniformMatrix4fv(nUniform, false, new Float32Array(normalMatrix.flatten()));  
  
}

var mvMatrixStack = [];

function mvPushMatrix(m) {
  if (m) {
    mvMatrixStack.push(m.dup());
    mvMatrix = m.dup();
  } else {
    mvMatrixStack.push(mvMatrix.dup());
  }
}

function mvPopMatrix() {
  if (!mvMatrixStack.length) {
    throw("Can't pop from an empty matrix stack.");
  }

  mvMatrix = mvMatrixStack.pop();
  return mvMatrix;
}

function mvRotate(angle, v) {
  var inRadians = angle * Math.PI / 180.0;

  var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
  multMatrix(m);
}


 // utils

// === Sylvester ===
// Vector and Matrix mathematics modules for JavaScript
// Copyright (c) 2007 James Coglan
// 
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
// THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

var Sylvester = {
  version: '0.1.3',
  precision: 1e-6
};

function Vector() {}
Vector.prototype = {

  // Returns element i of the vector
  e: function(i) {
    return (i < 1 || i > this.elements.length) ? null : this.elements[i-1];
  },

  // Returns the number of elements the vector has
  dimensions: function() {
    return this.elements.length;
  },

  // Returns the modulus ('length') of the vector
  modulus: function() {
    return Math.sqrt(this.dot(this));
  },

  // Returns true iff the vector is equal to the argument
  eql: function(vector) {
    var n = this.elements.length;
    var V = vector.elements || vector;
    if (n != V.length) { return false; }
    do {
      if (Math.abs(this.elements[n-1] - V[n-1]) > Sylvester.precision) { return false; }
    } while (--n);
    return true;
  },

  // Returns a copy of the vector
  dup: function() {
    return Vector.create(this.elements);
  },

  // Maps the vector to another vector according to the given function
  map: function(fn) {
    var elements = [];
    this.each(function(x, i) {
      elements.push(fn(x, i));
    });
    return Vector.create(elements);
  },
  
  // Calls the iterator for each element of the vector in turn
  each: function(fn) {
    var n = this.elements.length, k = n, i;
    do { i = k - n;
      fn(this.elements[i], i+1);
    } while (--n);
  },

  // Returns a new vector created by normalizing the receiver
  toUnitVector: function() {
    var r = this.modulus();
    if (r === 0) { return this.dup(); }
    return this.map(function(x) { return x/r; });
  },

  // Returns the angle between the vector and the argument (also a vector)
  angleFrom: function(vector) {
    var V = vector.elements || vector;
    var n = this.elements.length, k = n, i;
    if (n != V.length) { return null; }
    var dot = 0, mod1 = 0, mod2 = 0;
    // Work things out in parallel to save time
    this.each(function(x, i) {
      dot += x * V[i-1];
      mod1 += x * x;
      mod2 += V[i-1] * V[i-1];
    });
    mod1 = Math.sqrt(mod1); mod2 = Math.sqrt(mod2);
    if (mod1*mod2 === 0) { return null; }
    var theta = dot / (mod1*mod2);
    if (theta < -1) { theta = -1; }
    if (theta > 1) { theta = 1; }
    return Math.acos(theta);
  },

  // Returns true iff the vector is parallel to the argument
  isParallelTo: function(vector) {
    var angle = this.angleFrom(vector);
    return (angle === null) ? null : (angle <= Sylvester.precision);
  },

  // Returns true iff the vector is antiparallel to the argument
  isAntiparallelTo: function(vector) {
    var angle = this.angleFrom(vector);
    return (angle === null) ? null : (Math.abs(angle - Math.PI) <= Sylvester.precision);
  },

  // Returns true iff the vector is perpendicular to the argument
  isPerpendicularTo: function(vector) {
    var dot = this.dot(vector);
    return (dot === null) ? null : (Math.abs(dot) <= Sylvester.precision);
  },

  // Returns the result of adding the argument to the vector
  add: function(vector) {
    var V = vector.elements || vector;
    if (this.elements.length != V.length) { return null; }
    return this.map(function(x, i) { return x + V[i-1]; });
  },

  // Returns the result of subtracting the argument from the vector
  subtract: function(vector) {
    var V = vector.elements || vector;
    if (this.elements.length != V.length) { return null; }
    return this.map(function(x, i) { return x - V[i-1]; });
  },

  // Returns the result of multiplying the elements of the vector by the argument
  multiply: function(k) {
    return this.map(function(x) { return x*k; });
  },

  x: function(k) { return this.multiply(k); },

  // Returns the scalar product of the vector with the argument
  // Both vectors must have equal dimensionality
  dot: function(vector) {
    var V = vector.elements || vector;
    var i, product = 0, n = this.elements.length;
    if (n != V.length) { return null; }
    do { product += this.elements[n-1] * V[n-1]; } while (--n);
    return product;
  },

  // Returns the vector product of the vector with the argument
  // Both vectors must have dimensionality 3
  cross: function(vector) {
    var B = vector.elements || vector;
    if (this.elements.length != 3 || B.length != 3) { return null; }
    var A = this.elements;
    return Vector.create([
      (A[1] * B[2]) - (A[2] * B[1]),
      (A[2] * B[0]) - (A[0] * B[2]),
      (A[0] * B[1]) - (A[1] * B[0])
    ]);
  },

  // Returns the (absolute) largest element of the vector
  max: function() {
    var m = 0, n = this.elements.length, k = n, i;
    do { i = k - n;
      if (Math.abs(this.elements[i]) > Math.abs(m)) { m = this.elements[i]; }
    } while (--n);
    return m;
  },

  // Returns the index of the first match found
  indexOf: function(x) {
    var index = null, n = this.elements.length, k = n, i;
    do { i = k - n;
      if (index === null && this.elements[i] == x) {
        index = i + 1;
      }
    } while (--n);
    return index;
  },

  // Returns a diagonal matrix with the vector's elements as its diagonal elements
  toDiagonalMatrix: function() {
    return Matrix.Diagonal(this.elements);
  },

  // Returns the result of rounding the elements of the vector
  round: function() {
    return this.map(function(x) { return Math.round(x); });
  },

  // Returns a copy of the vector with elements set to the given value if they
  // differ from it by less than Sylvester.precision
  snapTo: function(x) {
    return this.map(function(y) {
      return (Math.abs(y - x) <= Sylvester.precision) ? x : y;
    });
  },

  // Returns the vector's distance from the argument, when considered as a point in space
  distanceFrom: function(obj) {
    if (obj.anchor) { return obj.distanceFrom(this); }
    var V = obj.elements || obj;
    if (V.length != this.elements.length) { return null; }
    var sum = 0, part;
    this.each(function(x, i) {
      part = x - V[i-1];
      sum += part * part;
    });
    return Math.sqrt(sum);
  },

  // Returns true if the vector is point on the given line
  liesOn: function(line) {
    return line.contains(this);
  },

  // Return true iff the vector is a point in the given plane
  liesIn: function(plane) {
    return plane.contains(this);
  },

  // Rotates the vector about the given object. The object should be a 
  // point if the vector is 2D, and a line if it is 3D. Be careful with line directions!
  rotate: function(t, obj) {
    var V, R, x, y, z;
    switch (this.elements.length) {
      case 2:
        V = obj.elements || obj;
        if (V.length != 2) { return null; }
        R = Matrix.Rotation(t).elements;
        x = this.elements[0] - V[0];
        y = this.elements[1] - V[1];
        return Vector.create([
          V[0] + R[0][0] * x + R[0][1] * y,
          V[1] + R[1][0] * x + R[1][1] * y
        ]);
        break;
      case 3:
        if (!obj.direction) { return null; }
        var C = obj.pointClosestTo(this).elements;
        R = Matrix.Rotation(t, obj.direction).elements;
        x = this.elements[0] - C[0];
        y = this.elements[1] - C[1];
        z = this.elements[2] - C[2];
        return Vector.create([
          C[0] + R[0][0] * x + R[0][1] * y + R[0][2] * z,
          C[1] + R[1][0] * x + R[1][1] * y + R[1][2] * z,
          C[2] + R[2][0] * x + R[2][1] * y + R[2][2] * z
        ]);
        break;
      default:
        return null;
    }
  },

  // Returns the result of reflecting the point in the given point, line or plane
  reflectionIn: function(obj) {
    if (obj.anchor) {
      // obj is a plane or line
      var P = this.elements.slice();
      var C = obj.pointClosestTo(P).elements;
      return Vector.create([C[0] + (C[0] - P[0]), C[1] + (C[1] - P[1]), C[2] + (C[2] - (P[2] || 0))]);
    } else {
      // obj is a point
      var Q = obj.elements || obj;
      if (this.elements.length != Q.length) { return null; }
      return this.map(function(x, i) { return Q[i-1] + (Q[i-1] - x); });
    }
  },

  // Utility to make sure vectors are 3D. If they are 2D, a zero z-component is added
  to3D: function() {
    var V = this.dup();
    switch (V.elements.length) {
      case 3: break;
      case 2: V.elements.push(0); break;
      default: return null;
    }
    return V;
  },

  // Returns a string representation of the vector
  inspect: function() {
    return '[' + this.elements.join(', ') + ']';
  },

  // Set vector's elements from an array
  setElements: function(els) {
    this.elements = (els.elements || els).slice();
    return this;
  }
};
  
// Constructor function
Vector.create = function(elements) {
  var V = new Vector();
  return V.setElements(elements);
};

// i, j, k unit vectors
Vector.i = Vector.create([1,0,0]);
Vector.j = Vector.create([0,1,0]);
Vector.k = Vector.create([0,0,1]);

// Random vector of size n
Vector.Random = function(n) {
  var elements = [];
  do { elements.push(Math.random());
  } while (--n);
  return Vector.create(elements);
};

// Vector filled with zeros
Vector.Zero = function(n) {
  var elements = [];
  do { elements.push(0);
  } while (--n);
  return Vector.create(elements);
};



function Matrix() {}
Matrix.prototype = {

  // Returns element (i,j) of the matrix
  e: function(i,j) {
    if (i < 1 || i > this.elements.length || j < 1 || j > this.elements[0].length) { return null; }
    return this.elements[i-1][j-1];
  },

  // Returns row k of the matrix as a vector
  row: function(i) {
    if (i > this.elements.length) { return null; }
    return Vector.create(this.elements[i-1]);
  },

  // Returns column k of the matrix as a vector
  col: function(j) {
    if (j > this.elements[0].length) { return null; }
    var col = [], n = this.elements.length, k = n, i;
    do { i = k - n;
      col.push(this.elements[i][j-1]);
    } while (--n);
    return Vector.create(col);
  },

  // Returns the number of rows/columns the matrix has
  dimensions: function() {
    return {rows: this.elements.length, cols: this.elements[0].length};
  },

  // Returns the number of rows in the matrix
  rows: function() {
    return this.elements.length;
  },

  // Returns the number of columns in the matrix
  cols: function() {
    return this.elements[0].length;
  },

  // Returns true iff the matrix is equal to the argument. You can supply
  // a vector as the argument, in which case the receiver must be a
  // one-column matrix equal to the vector.
  eql: function(matrix) {
    var M = matrix.elements || matrix;
    if (typeof(M[0][0]) == 'undefined') { M = Matrix.create(M).elements; }
    if (this.elements.length != M.length ||
        this.elements[0].length != M[0].length) { return false; }
    var ni = this.elements.length, ki = ni, i, nj, kj = this.elements[0].length, j;
    do { i = ki - ni;
      nj = kj;
      do { j = kj - nj;
        if (Math.abs(this.elements[i][j] - M[i][j]) > Sylvester.precision) { return false; }
      } while (--nj);
    } while (--ni);
    return true;
  },

  // Returns a copy of the matrix
  dup: function() {
    return Matrix.create(this.elements);
  },

  // Maps the matrix to another matrix (of the same dimensions) according to the given function
  map: function(fn) {
    var els = [], ni = this.elements.length, ki = ni, i, nj, kj = this.elements[0].length, j;
    do { i = ki - ni;
      nj = kj;
      els[i] = [];
      do { j = kj - nj;
        els[i][j] = fn(this.elements[i][j], i + 1, j + 1);
      } while (--nj);
    } while (--ni);
    return Matrix.create(els);
  },

  // Returns true iff the argument has the same dimensions as the matrix
  isSameSizeAs: function(matrix) {
    var M = matrix.elements || matrix;
    if (typeof(M[0][0]) == 'undefined') { M = Matrix.create(M).elements; }
    return (this.elements.length == M.length &&
        this.elements[0].length == M[0].length);
  },

  // Returns the result of adding the argument to the matrix
  add: function(matrix) {
    var M = matrix.elements || matrix;
    if (typeof(M[0][0]) == 'undefined') { M = Matrix.create(M).elements; }
    if (!this.isSameSizeAs(M)) { return null; }
    return this.map(function(x, i, j) { return x + M[i-1][j-1]; });
  },

  // Returns the result of subtracting the argument from the matrix
  subtract: function(matrix) {
    var M = matrix.elements || matrix;
    if (typeof(M[0][0]) == 'undefined') { M = Matrix.create(M).elements; }
    if (!this.isSameSizeAs(M)) { return null; }
    return this.map(function(x, i, j) { return x - M[i-1][j-1]; });
  },

  // Returns true iff the matrix can multiply the argument from the left
  canMultiplyFromLeft: function(matrix) {
    var M = matrix.elements || matrix;
    if (typeof(M[0][0]) == 'undefined') { M = Matrix.create(M).elements; }
    // this.columns should equal matrix.rows
    return (this.elements[0].length == M.length);
  },

  // Returns the result of multiplying the matrix from the right by the argument.
  // If the argument is a scalar then just multiply all the elements. If the argument is
  // a vector, a vector is returned, which saves you having to remember calling
  // col(1) on the result.
  multiply: function(matrix) {
    if (!matrix.elements) {
      return this.map(function(x) { return x * matrix; });
    }
    var returnVector = matrix.modulus ? true : false;
    var M = matrix.elements || matrix;
    if (typeof(M[0][0]) == 'undefined') { M = Matrix.create(M).elements; }
    if (!this.canMultiplyFromLeft(M)) { return null; }
    var ni = this.elements.length, ki = ni, i, nj, kj = M[0].length, j;
    var cols = this.elements[0].length, elements = [], sum, nc, c;
    do { i = ki - ni;
      elements[i] = [];
      nj = kj;
      do { j = kj - nj;
        sum = 0;
        nc = cols;
        do { c = cols - nc;
          sum += this.elements[i][c] * M[c][j];
        } while (--nc);
        elements[i][j] = sum;
      } while (--nj);
    } while (--ni);
    var M = Matrix.create(elements);
    return returnVector ? M.col(1) : M;
  },

  x: function(matrix) { return this.multiply(matrix); },

  // Returns a submatrix taken from the matrix
  // Argument order is: start row, start col, nrows, ncols
  // Element selection wraps if the required index is outside the matrix's bounds, so you could
  // use this to perform row/column cycling or copy-augmenting.
  minor: function(a, b, c, d) {
    var elements = [], ni = c, i, nj, j;
    var rows = this.elements.length, cols = this.elements[0].length;
    do { i = c - ni;
      elements[i] = [];
      nj = d;
      do { j = d - nj;
        elements[i][j] = this.elements[(a+i-1)%rows][(b+j-1)%cols];
      } while (--nj);
    } while (--ni);
    return Matrix.create(elements);
  },

  // Returns the transpose of the matrix
  transpose: function() {
    var rows = this.elements.length, cols = this.elements[0].length;
    var elements = [], ni = cols, i, nj, j;
    do { i = cols - ni;
      elements[i] = [];
      nj = rows;
      do { j = rows - nj;
        elements[i][j] = this.elements[j][i];
      } while (--nj);
    } while (--ni);
    return Matrix.create(elements);
  },

  // Returns true iff the matrix is square
  isSquare: function() {
    return (this.elements.length == this.elements[0].length);
  },

  // Returns the (absolute) largest element of the matrix
  max: function() {
    var m = 0, ni = this.elements.length, ki = ni, i, nj, kj = this.elements[0].length, j;
    do { i = ki - ni;
      nj = kj;
      do { j = kj - nj;
        if (Math.abs(this.elements[i][j]) > Math.abs(m)) { m = this.elements[i][j]; }
      } while (--nj);
    } while (--ni);
    return m;
  },

  // Returns the indeces of the first match found by reading row-by-row from left to right
  indexOf: function(x) {
    var index = null, ni = this.elements.length, ki = ni, i, nj, kj = this.elements[0].length, j;
    do { i = ki - ni;
      nj = kj;
      do { j = kj - nj;
        if (this.elements[i][j] == x) { return {i: i+1, j: j+1}; }
      } while (--nj);
    } while (--ni);
    return null;
  },

  // If the matrix is square, returns the diagonal elements as a vector.
  // Otherwise, returns null.
  diagonal: function() {
    if (!this.isSquare) { return null; }
    var els = [], n = this.elements.length, k = n, i;
    do { i = k - n;
      els.push(this.elements[i][i]);
    } while (--n);
    return Vector.create(els);
  },

  // Make the matrix upper (right) triangular by Gaussian elimination.
  // This method only adds multiples of rows to other rows. No rows are
  // scaled up or switched, and the determinant is preserved.
  toRightTriangular: function() {
    var M = this.dup(), els;
    var n = this.elements.length, k = n, i, np, kp = this.elements[0].length, p;
    do { i = k - n;
      if (M.elements[i][i] == 0) {
        for (j = i + 1; j < k; j++) {
          if (M.elements[j][i] != 0) {
            els = []; np = kp;
            do { p = kp - np;
              els.push(M.elements[i][p] + M.elements[j][p]);
            } while (--np);
            M.elements[i] = els;
            break;
          }
        }
      }
      if (M.elements[i][i] != 0) {
        for (j = i + 1; j < k; j++) {
          var multiplier = M.elements[j][i] / M.elements[i][i];
          els = []; np = kp;
          do { p = kp - np;
            // Elements with column numbers up to an including the number
            // of the row that we're subtracting can safely be set straight to
            // zero, since that's the point of this routine and it avoids having
            // to loop over and correct rounding errors later
            els.push(p <= i ? 0 : M.elements[j][p] - M.elements[i][p] * multiplier);
          } while (--np);
          M.elements[j] = els;
        }
      }
    } while (--n);
    return M;
  },

  toUpperTriangular: function() { return this.toRightTriangular(); },

  // Returns the determinant for square matrices
  determinant: function() {
    if (!this.isSquare()) { return null; }
    var M = this.toRightTriangular();
    var det = M.elements[0][0], n = M.elements.length - 1, k = n, i;
    do { i = k - n + 1;
      det = det * M.elements[i][i];
    } while (--n);
    return det;
  },

  det: function() { return this.determinant(); },

  // Returns true iff the matrix is singular
  isSingular: function() {
    return (this.isSquare() && this.determinant() === 0);
  },

  // Returns the trace for square matrices
  trace: function() {
    if (!this.isSquare()) { return null; }
    var tr = this.elements[0][0], n = this.elements.length - 1, k = n, i;
    do { i = k - n + 1;
      tr += this.elements[i][i];
    } while (--n);
    return tr;
  },

  tr: function() { return this.trace(); },

  // Returns the rank of the matrix
  rank: function() {
    var M = this.toRightTriangular(), rank = 0;
    var ni = this.elements.length, ki = ni, i, nj, kj = this.elements[0].length, j;
    do { i = ki - ni;
      nj = kj;
      do { j = kj - nj;
        if (Math.abs(M.elements[i][j]) > Sylvester.precision) { rank++; break; }
      } while (--nj);
    } while (--ni);
    return rank;
  },
  
  rk: function() { return this.rank(); },

  // Returns the result of attaching the given argument to the right-hand side of the matrix
  augment: function(matrix) {
    var M = matrix.elements || matrix;
    if (typeof(M[0][0]) == 'undefined') { M = Matrix.create(M).elements; }
    var T = this.dup(), cols = T.elements[0].length;
    var ni = T.elements.length, ki = ni, i, nj, kj = M[0].length, j;
    if (ni != M.length) { return null; }
    do { i = ki - ni;
      nj = kj;
      do { j = kj - nj;
        T.elements[i][cols + j] = M[i][j];
      } while (--nj);
    } while (--ni);
    return T;
  },

  // Returns the inverse (if one exists) using Gauss-Jordan
  inverse: function() {
    if (!this.isSquare() || this.isSingular()) { return null; }
    var ni = this.elements.length, ki = ni, i, j;
    var M = this.augment(Matrix.I(ni)).toRightTriangular();
    var np, kp = M.elements[0].length, p, els, divisor;
    var inverse_elements = [], new_element;
    // Matrix is non-singular so there will be no zeros on the diagonal
    // Cycle through rows from last to first
    do { i = ni - 1;
      // First, normalise diagonal elements to 1
      els = []; np = kp;
      inverse_elements[i] = [];
      divisor = M.elements[i][i];
      do { p = kp - np;
        new_element = M.elements[i][p] / divisor;
        els.push(new_element);
        // Shuffle of the current row of the right hand side into the results
        // array as it will not be modified by later runs through this loop
        if (p >= ki) { inverse_elements[i].push(new_element); }
      } while (--np);
      M.elements[i] = els;
      // Then, subtract this row from those above it to
      // give the identity matrix on the left hand side
      for (j = 0; j < i; j++) {
        els = []; np = kp;
        do { p = kp - np;
          els.push(M.elements[j][p] - M.elements[i][p] * M.elements[j][i]);
        } while (--np);
        M.elements[j] = els;
      }
    } while (--ni);
    return Matrix.create(inverse_elements);
  },

  inv: function() { return this.inverse(); },

  // Returns the result of rounding all the elements
  round: function() {
    return this.map(function(x) { return Math.round(x); });
  },

  // Returns a copy of the matrix with elements set to the given value if they
  // differ from it by less than Sylvester.precision
  snapTo: function(x) {
    return this.map(function(p) {
      return (Math.abs(p - x) <= Sylvester.precision) ? x : p;
    });
  },

  // Returns a string representation of the matrix
  inspect: function() {
    var matrix_rows = [];
    var n = this.elements.length, k = n, i;
    do { i = k - n;
      matrix_rows.push(Vector.create(this.elements[i]).inspect());
    } while (--n);
    return matrix_rows.join('\n');
  },

  // Set the matrix's elements from an array. If the argument passed
  // is a vector, the resulting matrix will be a single column.
  setElements: function(els) {
    var i, elements = els.elements || els;
    if (typeof(elements[0][0]) != 'undefined') {
      var ni = elements.length, ki = ni, nj, kj, j;
      this.elements = [];
      do { i = ki - ni;
        nj = elements[i].length; kj = nj;
        this.elements[i] = [];
        do { j = kj - nj;
          this.elements[i][j] = elements[i][j];
        } while (--nj);
      } while(--ni);
      return this;
    }
    var n = elements.length, k = n;
    this.elements = [];
    do { i = k - n;
      this.elements.push([elements[i]]);
    } while (--n);
    return this;
  }
};

// Constructor function
Matrix.create = function(elements) {
  var M = new Matrix();
  return M.setElements(elements);
};

// Identity matrix of size n
Matrix.I = function(n) {
  var els = [], k = n, i, nj, j;
  do { i = k - n;
    els[i] = []; nj = k;
    do { j = k - nj;
      els[i][j] = (i == j) ? 1 : 0;
    } while (--nj);
  } while (--n);
  return Matrix.create(els);
};

// Diagonal matrix - all off-diagonal elements are zero
Matrix.Diagonal = function(elements) {
  var n = elements.length, k = n, i;
  var M = Matrix.I(n);
  do { i = k - n;
    M.elements[i][i] = elements[i];
  } while (--n);
  return M;
};

// Rotation matrix about some axis. If no axis is
// supplied, assume we're after a 2D transform
Matrix.Rotation = function(theta, a) {
  if (!a) {
    return Matrix.create([
      [Math.cos(theta),  -Math.sin(theta)],
      [Math.sin(theta),   Math.cos(theta)]
    ]);
  }
  var axis = a.dup();
  if (axis.elements.length != 3) { return null; }
  var mod = axis.modulus();
  var x = axis.elements[0]/mod, y = axis.elements[1]/mod, z = axis.elements[2]/mod;
  var s = Math.sin(theta), c = Math.cos(theta), t = 1 - c;
  // Formula derived here: http://www.gamedev.net/reference/articles/article1199.asp
  // That proof rotates the co-ordinate system so theta
  // becomes -theta and sin becomes -sin here.
  return Matrix.create([
    [ t*x*x + c, t*x*y - s*z, t*x*z + s*y ],
    [ t*x*y + s*z, t*y*y + c, t*y*z - s*x ],
    [ t*x*z - s*y, t*y*z + s*x, t*z*z + c ]
  ]);
};

// Special case rotations
Matrix.RotationX = function(t) {
  var c = Math.cos(t), s = Math.sin(t);
  return Matrix.create([
    [  1,  0,  0 ],
    [  0,  c, -s ],
    [  0,  s,  c ]
  ]);
};
Matrix.RotationY = function(t) {
  var c = Math.cos(t), s = Math.sin(t);
  return Matrix.create([
    [  c,  0,  s ],
    [  0,  1,  0 ],
    [ -s,  0,  c ]
  ]);
};
Matrix.RotationZ = function(t) {
  var c = Math.cos(t), s = Math.sin(t);
  return Matrix.create([
    [  c, -s,  0 ],
    [  s,  c,  0 ],
    [  0,  0,  1 ]
  ]);
};

// Random matrix of n rows, m columns
Matrix.Random = function(n, m) {
  return Matrix.Zero(n, m).map(
    function() { return Math.random(); }
  );
};

// Matrix filled with zeros
Matrix.Zero = function(n, m) {
  var els = [], ni = n, i, nj, j;
  do { i = n - ni;
    els[i] = [];
    nj = m;
    do { j = m - nj;
      els[i][j] = 0;
    } while (--nj);
  } while (--ni);
  return Matrix.create(els);
};



function Line() {}
Line.prototype = {

  // Returns true if the argument occupies the same space as the line
  eql: function(line) {
    return (this.isParallelTo(line) && this.contains(line.anchor));
  },

  // Returns a copy of the line
  dup: function() {
    return Line.create(this.anchor, this.direction);
  },

  // Returns the result of translating the line by the given vector/array
  translate: function(vector) {
    var V = vector.elements || vector;
    return Line.create([
      this.anchor.elements[0] + V[0],
      this.anchor.elements[1] + V[1],
      this.anchor.elements[2] + (V[2] || 0)
    ], this.direction);
  },

  // Returns true if the line is parallel to the argument. Here, 'parallel to'
  // means that the argument's direction is either parallel or antiparallel to
  // the line's own direction. A line is parallel to a plane if the two do not
  // have a unique intersection.
  isParallelTo: function(obj) {
    if (obj.normal) { return obj.isParallelTo(this); }
    var theta = this.direction.angleFrom(obj.direction);
    return (Math.abs(theta) <= Sylvester.precision || Math.abs(theta - Math.PI) <= Sylvester.precision);
  },

  // Returns the line's perpendicular distance from the argument,
  // which can be a point, a line or a plane
  distanceFrom: function(obj) {
    if (obj.normal) { return obj.distanceFrom(this); }
    if (obj.direction) {
      // obj is a line
      if (this.isParallelTo(obj)) { return this.distanceFrom(obj.anchor); }
      var N = this.direction.cross(obj.direction).toUnitVector().elements;
      var A = this.anchor.elements, B = obj.anchor.elements;
      return Math.abs((A[0] - B[0]) * N[0] + (A[1] - B[1]) * N[1] + (A[2] - B[2]) * N[2]);
    } else {
      // obj is a point
      var P = obj.elements || obj;
      var A = this.anchor.elements, D = this.direction.elements;
      var PA1 = P[0] - A[0], PA2 = P[1] - A[1], PA3 = (P[2] || 0) - A[2];
      var modPA = Math.sqrt(PA1*PA1 + PA2*PA2 + PA3*PA3);
      if (modPA === 0) return 0;
      // Assumes direction vector is normalized
      var cosTheta = (PA1 * D[0] + PA2 * D[1] + PA3 * D[2]) / modPA;
      var sin2 = 1 - cosTheta*cosTheta;
      return Math.abs(modPA * Math.sqrt(sin2 < 0 ? 0 : sin2));
    }
  },

  // Returns true iff the argument is a point on the line
  contains: function(point) {
    var dist = this.distanceFrom(point);
    return (dist !== null && dist <= Sylvester.precision);
  },

  // Returns true iff the line lies in the given plane
  liesIn: function(plane) {
    return plane.contains(this);
  },

  // Returns true iff the line has a unique point of intersection with the argument
  intersects: function(obj) {
    if (obj.normal) { return obj.intersects(this); }
    return (!this.isParallelTo(obj) && this.distanceFrom(obj) <= Sylvester.precision);
  },

  // Returns the unique intersection point with the argument, if one exists
  intersectionWith: function(obj) {
    if (obj.normal) { return obj.intersectionWith(this); }
    if (!this.intersects(obj)) { return null; }
    var P = this.anchor.elements, X = this.direction.elements,
        Q = obj.anchor.elements, Y = obj.direction.elements;
    var X1 = X[0], X2 = X[1], X3 = X[2], Y1 = Y[0], Y2 = Y[1], Y3 = Y[2];
    var PsubQ1 = P[0] - Q[0], PsubQ2 = P[1] - Q[1], PsubQ3 = P[2] - Q[2];
    var XdotQsubP = - X1*PsubQ1 - X2*PsubQ2 - X3*PsubQ3;
    var YdotPsubQ = Y1*PsubQ1 + Y2*PsubQ2 + Y3*PsubQ3;
    var XdotX = X1*X1 + X2*X2 + X3*X3;
    var YdotY = Y1*Y1 + Y2*Y2 + Y3*Y3;
    var XdotY = X1*Y1 + X2*Y2 + X3*Y3;
    var k = (XdotQsubP * YdotY / XdotX + XdotY * YdotPsubQ) / (YdotY - XdotY * XdotY);
    return Vector.create([P[0] + k*X1, P[1] + k*X2, P[2] + k*X3]);
  },

  // Returns the point on the line that is closest to the given point or line
  pointClosestTo: function(obj) {
    if (obj.direction) {
      // obj is a line
      if (this.intersects(obj)) { return this.intersectionWith(obj); }
      if (this.isParallelTo(obj)) { return null; }
      var D = this.direction.elements, E = obj.direction.elements;
      var D1 = D[0], D2 = D[1], D3 = D[2], E1 = E[0], E2 = E[1], E3 = E[2];
      // Create plane containing obj and the shared normal and intersect this with it
      // Thank you: http://www.cgafaq.info/wiki/Line-line_distance
      var x = (D3 * E1 - D1 * E3), y = (D1 * E2 - D2 * E1), z = (D2 * E3 - D3 * E2);
      var N = Vector.create([x * E3 - y * E2, y * E1 - z * E3, z * E2 - x * E1]);
      var P = Plane.create(obj.anchor, N);
      return P.intersectionWith(this);
    } else {
      // obj is a point
      var P = obj.elements || obj;
      if (this.contains(P)) { return Vector.create(P); }
      var A = this.anchor.elements, D = this.direction.elements;
      var D1 = D[0], D2 = D[1], D3 = D[2], A1 = A[0], A2 = A[1], A3 = A[2];
      var x = D1 * (P[1]-A2) - D2 * (P[0]-A1), y = D2 * ((P[2] || 0) - A3) - D3 * (P[1]-A2),
          z = D3 * (P[0]-A1) - D1 * ((P[2] || 0) - A3);
      var V = Vector.create([D2 * x - D3 * z, D3 * y - D1 * x, D1 * z - D2 * y]);
      var k = this.distanceFrom(P) / V.modulus();
      return Vector.create([
        P[0] + V.elements[0] * k,
        P[1] + V.elements[1] * k,
        (P[2] || 0) + V.elements[2] * k
      ]);
    }
  },

  // Returns a copy of the line rotated by t radians about the given line. Works by
  // finding the argument's closest point to this line's anchor point (call this C) and
  // rotating the anchor about C. Also rotates the line's direction about the argument's.
  // Be careful with this - the rotation axis' direction affects the outcome!
  rotate: function(t, line) {
    // If we're working in 2D
    if (typeof(line.direction) == 'undefined') { line = Line.create(line.to3D(), Vector.k); }
    var R = Matrix.Rotation(t, line.direction).elements;
    var C = line.pointClosestTo(this.anchor).elements;
    var A = this.anchor.elements, D = this.direction.elements;
    var C1 = C[0], C2 = C[1], C3 = C[2], A1 = A[0], A2 = A[1], A3 = A[2];
    var x = A1 - C1, y = A2 - C2, z = A3 - C3;
    return Line.create([
      C1 + R[0][0] * x + R[0][1] * y + R[0][2] * z,
      C2 + R[1][0] * x + R[1][1] * y + R[1][2] * z,
      C3 + R[2][0] * x + R[2][1] * y + R[2][2] * z
    ], [
      R[0][0] * D[0] + R[0][1] * D[1] + R[0][2] * D[2],
      R[1][0] * D[0] + R[1][1] * D[1] + R[1][2] * D[2],
      R[2][0] * D[0] + R[2][1] * D[1] + R[2][2] * D[2]
    ]);
  },

  // Returns the line's reflection in the given point or line
  reflectionIn: function(obj) {
    if (obj.normal) {
      // obj is a plane
      var A = this.anchor.elements, D = this.direction.elements;
      var A1 = A[0], A2 = A[1], A3 = A[2], D1 = D[0], D2 = D[1], D3 = D[2];
      var newA = this.anchor.reflectionIn(obj).elements;
      // Add the line's direction vector to its anchor, then mirror that in the plane
      var AD1 = A1 + D1, AD2 = A2 + D2, AD3 = A3 + D3;
      var Q = obj.pointClosestTo([AD1, AD2, AD3]).elements;
      var newD = [Q[0] + (Q[0] - AD1) - newA[0], Q[1] + (Q[1] - AD2) - newA[1], Q[2] + (Q[2] - AD3) - newA[2]];
      return Line.create(newA, newD);
    } else if (obj.direction) {
      // obj is a line - reflection obtained by rotating PI radians about obj
      return this.rotate(Math.PI, obj);
    } else {
      // obj is a point - just reflect the line's anchor in it
      var P = obj.elements || obj;
      return Line.create(this.anchor.reflectionIn([P[0], P[1], (P[2] || 0)]), this.direction);
    }
  },

  // Set the line's anchor point and direction.
  setVectors: function(anchor, direction) {
    // Need to do this so that line's properties are not
    // references to the arguments passed in
    anchor = Vector.create(anchor);
    direction = Vector.create(direction);
    if (anchor.elements.length == 2) {anchor.elements.push(0); }
    if (direction.elements.length == 2) { direction.elements.push(0); }
    if (anchor.elements.length > 3 || direction.elements.length > 3) { return null; }
    var mod = direction.modulus();
    if (mod === 0) { return null; }
    this.anchor = anchor;
    this.direction = Vector.create([
      direction.elements[0] / mod,
      direction.elements[1] / mod,
      direction.elements[2] / mod
    ]);
    return this;
  }
};

  
// Constructor function
Line.create = function(anchor, direction) {
  var L = new Line();
  return L.setVectors(anchor, direction);
};

// Axes
Line.X = Line.create(Vector.Zero(3), Vector.i);
Line.Y = Line.create(Vector.Zero(3), Vector.j);
Line.Z = Line.create(Vector.Zero(3), Vector.k);



function Plane() {}
Plane.prototype = {

  // Returns true iff the plane occupies the same space as the argument
  eql: function(plane) {
    return (this.contains(plane.anchor) && this.isParallelTo(plane));
  },

  // Returns a copy of the plane
  dup: function() {
    return Plane.create(this.anchor, this.normal);
  },

  // Returns the result of translating the plane by the given vector
  translate: function(vector) {
    var V = vector.elements || vector;
    return Plane.create([
      this.anchor.elements[0] + V[0],
      this.anchor.elements[1] + V[1],
      this.anchor.elements[2] + (V[2] || 0)
    ], this.normal);
  },

  // Returns true iff the plane is parallel to the argument. Will return true
  // if the planes are equal, or if you give a line and it lies in the plane.
  isParallelTo: function(obj) {
    var theta;
    if (obj.normal) {
      // obj is a plane
      theta = this.normal.angleFrom(obj.normal);
      return (Math.abs(theta) <= Sylvester.precision || Math.abs(Math.PI - theta) <= Sylvester.precision);
    } else if (obj.direction) {
      // obj is a line
      return this.normal.isPerpendicularTo(obj.direction);
    }
    return null;
  },
  
  // Returns true iff the receiver is perpendicular to the argument
  isPerpendicularTo: function(plane) {
    var theta = this.normal.angleFrom(plane.normal);
    return (Math.abs(Math.PI/2 - theta) <= Sylvester.precision);
  },

  // Returns the plane's distance from the given object (point, line or plane)
  distanceFrom: function(obj) {
    if (this.intersects(obj) || this.contains(obj)) { return 0; }
    if (obj.anchor) {
      // obj is a plane or line
      var A = this.anchor.elements, B = obj.anchor.elements, N = this.normal.elements;
      return Math.abs((A[0] - B[0]) * N[0] + (A[1] - B[1]) * N[1] + (A[2] - B[2]) * N[2]);
    } else {
      // obj is a point
      var P = obj.elements || obj;
      var A = this.anchor.elements, N = this.normal.elements;
      return Math.abs((A[0] - P[0]) * N[0] + (A[1] - P[1]) * N[1] + (A[2] - (P[2] || 0)) * N[2]);
    }
  },

  // Returns true iff the plane contains the given point or line
  contains: function(obj) {
    if (obj.normal) { return null; }
    if (obj.direction) {
      return (this.contains(obj.anchor) && this.contains(obj.anchor.add(obj.direction)));
    } else {
      var P = obj.elements || obj;
      var A = this.anchor.elements, N = this.normal.elements;
      var diff = Math.abs(N[0]*(A[0] - P[0]) + N[1]*(A[1] - P[1]) + N[2]*(A[2] - (P[2] || 0)));
      return (diff <= Sylvester.precision);
    }
  },

  // Returns true iff the plane has a unique point/line of intersection with the argument
  intersects: function(obj) {
    if (typeof(obj.direction) == 'undefined' && typeof(obj.normal) == 'undefined') { return null; }
    return !this.isParallelTo(obj);
  },

  // Returns the unique intersection with the argument, if one exists. The result
  // will be a vector if a line is supplied, and a line if a plane is supplied.
  intersectionWith: function(obj) {
    if (!this.intersects(obj)) { return null; }
    if (obj.direction) {
      // obj is a line
      var A = obj.anchor.elements, D = obj.direction.elements,
          P = this.anchor.elements, N = this.normal.elements;
      var multiplier = (N[0]*(P[0]-A[0]) + N[1]*(P[1]-A[1]) + N[2]*(P[2]-A[2])) / (N[0]*D[0] + N[1]*D[1] + N[2]*D[2]);
      return Vector.create([A[0] + D[0]*multiplier, A[1] + D[1]*multiplier, A[2] + D[2]*multiplier]);
    } else if (obj.normal) {
      // obj is a plane
      var direction = this.normal.cross(obj.normal).toUnitVector();
      // To find an anchor point, we find one co-ordinate that has a value
      // of zero somewhere on the intersection, and remember which one we picked
      var N = this.normal.elements, A = this.anchor.elements,
          O = obj.normal.elements, B = obj.anchor.elements;
      var solver = Matrix.Zero(2,2), i = 0;
      while (solver.isSingular()) {
        i++;
        solver = Matrix.create([
          [ N[i%3], N[(i+1)%3] ],
          [ O[i%3], O[(i+1)%3]  ]
        ]);
      }
      // Then we solve the simultaneous equations in the remaining dimensions
      var inverse = solver.inverse().elements;
      var x = N[0]*A[0] + N[1]*A[1] + N[2]*A[2];
      var y = O[0]*B[0] + O[1]*B[1] + O[2]*B[2];
      var intersection = [
        inverse[0][0] * x + inverse[0][1] * y,
        inverse[1][0] * x + inverse[1][1] * y
      ];
      var anchor = [];
      for (var j = 1; j <= 3; j++) {
        // This formula picks the right element from intersection by
        // cycling depending on which element we set to zero above
        anchor.push((i == j) ? 0 : intersection[(j + (5 - i)%3)%3]);
      }
      return Line.create(anchor, direction);
    }
  },

  // Returns the point in the plane closest to the given point
  pointClosestTo: function(point) {
    var P = point.elements || point;
    var A = this.anchor.elements, N = this.normal.elements;
    var dot = (A[0] - P[0]) * N[0] + (A[1] - P[1]) * N[1] + (A[2] - (P[2] || 0)) * N[2];
    return Vector.create([P[0] + N[0] * dot, P[1] + N[1] * dot, (P[2] || 0) + N[2] * dot]);
  },

  // Returns a copy of the plane, rotated by t radians about the given line
  // See notes on Line#rotate.
  rotate: function(t, line) {
    var R = Matrix.Rotation(t, line.direction).elements;
    var C = line.pointClosestTo(this.anchor).elements;
    var A = this.anchor.elements, N = this.normal.elements;
    var C1 = C[0], C2 = C[1], C3 = C[2], A1 = A[0], A2 = A[1], A3 = A[2];
    var x = A1 - C1, y = A2 - C2, z = A3 - C3;
    return Plane.create([
      C1 + R[0][0] * x + R[0][1] * y + R[0][2] * z,
      C2 + R[1][0] * x + R[1][1] * y + R[1][2] * z,
      C3 + R[2][0] * x + R[2][1] * y + R[2][2] * z
    ], [
      R[0][0] * N[0] + R[0][1] * N[1] + R[0][2] * N[2],
      R[1][0] * N[0] + R[1][1] * N[1] + R[1][2] * N[2],
      R[2][0] * N[0] + R[2][1] * N[1] + R[2][2] * N[2]
    ]);
  },

  // Returns the reflection of the plane in the given point, line or plane.
  reflectionIn: function(obj) {
    if (obj.normal) {
      // obj is a plane
      var A = this.anchor.elements, N = this.normal.elements;
      var A1 = A[0], A2 = A[1], A3 = A[2], N1 = N[0], N2 = N[1], N3 = N[2];
      var newA = this.anchor.reflectionIn(obj).elements;
      // Add the plane's normal to its anchor, then mirror that in the other plane
      var AN1 = A1 + N1, AN2 = A2 + N2, AN3 = A3 + N3;
      var Q = obj.pointClosestTo([AN1, AN2, AN3]).elements;
      var newN = [Q[0] + (Q[0] - AN1) - newA[0], Q[1] + (Q[1] - AN2) - newA[1], Q[2] + (Q[2] - AN3) - newA[2]];
      return Plane.create(newA, newN);
    } else if (obj.direction) {
      // obj is a line
      return this.rotate(Math.PI, obj);
    } else {
      // obj is a point
      var P = obj.elements || obj;
      return Plane.create(this.anchor.reflectionIn([P[0], P[1], (P[2] || 0)]), this.normal);
    }
  },

  // Sets the anchor point and normal to the plane. If three arguments are specified,
  // the normal is calculated by assuming the three points should lie in the same plane.
  // If only two are sepcified, the second is taken to be the normal. Normal vector is
  // normalised before storage.
  setVectors: function(anchor, v1, v2) {
    anchor = Vector.create(anchor);
    anchor = anchor.to3D(); if (anchor === null) { return null; }
    v1 = Vector.create(v1);
    v1 = v1.to3D(); if (v1 === null) { return null; }
    if (typeof(v2) == 'undefined') {
      v2 = null;
    } else {
      v2 = Vector.create(v2);
      v2 = v2.to3D(); if (v2 === null) { return null; }
    }
    var A1 = anchor.elements[0], A2 = anchor.elements[1], A3 = anchor.elements[2];
    var v11 = v1.elements[0], v12 = v1.elements[1], v13 = v1.elements[2];
    var normal, mod;
    if (v2 !== null) {
      var v21 = v2.elements[0], v22 = v2.elements[1], v23 = v2.elements[2];
      normal = Vector.create([
        (v12 - A2) * (v23 - A3) - (v13 - A3) * (v22 - A2),
        (v13 - A3) * (v21 - A1) - (v11 - A1) * (v23 - A3),
        (v11 - A1) * (v22 - A2) - (v12 - A2) * (v21 - A1)
      ]);
      mod = normal.modulus();
      if (mod === 0) { return null; }
      normal = Vector.create([normal.elements[0] / mod, normal.elements[1] / mod, normal.elements[2] / mod]);
    } else {
      mod = Math.sqrt(v11*v11 + v12*v12 + v13*v13);
      if (mod === 0) { return null; }
      normal = Vector.create([v1.elements[0] / mod, v1.elements[1] / mod, v1.elements[2] / mod]);
    }
    this.anchor = anchor;
    this.normal = normal;
    return this;
  }
};

// Constructor function
Plane.create = function(anchor, v1, v2) {
  var P = new Plane();
  return P.setVectors(anchor, v1, v2);
};

// X-Y-Z planes
Plane.XY = Plane.create(Vector.Zero(3), Vector.k);
Plane.YZ = Plane.create(Vector.Zero(3), Vector.i);
Plane.ZX = Plane.create(Vector.Zero(3), Vector.j);
Plane.YX = Plane.XY; Plane.ZY = Plane.YZ; Plane.XZ = Plane.ZX;

// Utility functions
var $V = Vector.create;
var $M = Matrix.create;
var $L = Line.create;
var $P = Plane.create;


Matrix.Translation = function (v)
{
  if (v.elements.length == 2) {
    var r = Matrix.I(3);
    r.elements[2][0] = v.elements[0];
    r.elements[2][1] = v.elements[1];
    return r;
  }

  if (v.elements.length == 3) {
    var r = Matrix.I(4);
    r.elements[0][3] = v.elements[0];
    r.elements[1][3] = v.elements[1];
    r.elements[2][3] = v.elements[2];
    return r;
  }

  throw "Invalid length for Translation";
}

Matrix.prototype.flatten = function ()
{
    var result = [];
    if (this.elements.length == 0)
        return [];


    for (var j = 0; j < this.elements[0].length; j++)
        for (var i = 0; i < this.elements.length; i++)
            result.push(this.elements[i][j]);
    return result;
}

Matrix.prototype.ensure4x4 = function()
{
    if (this.elements.length == 4 &&
        this.elements[0].length == 4)
        return this;

    if (this.elements.length > 4 ||
        this.elements[0].length > 4)
        return null;

    for (var i = 0; i < this.elements.length; i++) {
        for (var j = this.elements[i].length; j < 4; j++) {
            if (i == j)
                this.elements[i].push(1);
            else
                this.elements[i].push(0);
        }
    }

    for (var i = this.elements.length; i < 4; i++) {
        if (i == 0)
            this.elements.push([1, 0, 0, 0]);
        else if (i == 1)
            this.elements.push([0, 1, 0, 0]);
        else if (i == 2)
            this.elements.push([0, 0, 1, 0]);
        else if (i == 3)
            this.elements.push([0, 0, 0, 1]);
    }

    return this;
};

Matrix.prototype.make3x3 = function()
{
    if (this.elements.length != 4 ||
        this.elements[0].length != 4)
        return null;

    return Matrix.create([[this.elements[0][0], this.elements[0][1], this.elements[0][2]],
                          [this.elements[1][0], this.elements[1][1], this.elements[1][2]],
                          [this.elements[2][0], this.elements[2][1], this.elements[2][2]]]);
};

Vector.prototype.flatten = function ()
{
    return this.elements;
};

function mht(m) {
    var s = "";
    if (m.length == 16) {
        for (var i = 0; i < 4; i++) {
            s += "<span style='font-family: monospace'>[" + m[i*4+0].toFixed(4) + "," + m[i*4+1].toFixed(4) + "," + m[i*4+2].toFixed(4) + "," + m[i*4+3].toFixed(4) + "]</span><br>";
        }
    } else if (m.length == 9) {
        for (var i = 0; i < 3; i++) {
            s += "<span style='font-family: monospace'>[" + m[i*3+0].toFixed(4) + "," + m[i*3+1].toFixed(4) + "," + m[i*3+2].toFixed(4) + "]</font><br>";
        }
    } else {
        return m.toString();
    }
    return s;
}

//
// gluLookAt
//
function makeLookAt(ex, ey, ez,
                    cx, cy, cz,
                    ux, uy, uz)
{
    var eye = $V([ex, ey, ez]);
    var center = $V([cx, cy, cz]);
    var up = $V([ux, uy, uz]);

    var mag;

    var z = eye.subtract(center).toUnitVector();
    var x = up.cross(z).toUnitVector();
    var y = z.cross(x).toUnitVector();

    var m = $M([[x.e(1), x.e(2), x.e(3), 0],
                [y.e(1), y.e(2), y.e(3), 0],
                [z.e(1), z.e(2), z.e(3), 0],
                [0, 0, 0, 1]]);

    var t = $M([[1, 0, 0, -ex],
                [0, 1, 0, -ey],
                [0, 0, 1, -ez],
                [0, 0, 0, 1]]);
    return m.x(t);
}

//
// glOrtho
//
function makeOrtho(left, right,
                   bottom, top,
                   znear, zfar)
{
    var tx = -(right+left)/(right-left);
    var ty = -(top+bottom)/(top-bottom);
    var tz = -(zfar+znear)/(zfar-znear);

    return $M([[2/(right-left), 0, 0, tx],
               [0, 2/(top-bottom), 0, ty],
               [0, 0, -2/(zfar-znear), tz],
               [0, 0, 0, 1]]);
}

//
// gluPerspective
//
function makePerspective(fovy, aspect, znear, zfar)
{
    var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
    var ymin = -ymax;
    var xmin = ymin * aspect;
    var xmax = ymax * aspect;

    return makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
}

//
// glFrustum
//
function makeFrustum(left, right,
                     bottom, top,
                     znear, zfar)
{
    var X = 2*znear/(right-left);
    var Y = 2*znear/(top-bottom);
    var A = (right+left)/(right-left);
    var B = (top+bottom)/(top-bottom);
    var C = -(zfar+znear)/(zfar-znear);
    var D = -2*zfar*znear/(zfar-znear);

    return $M([[X, 0, A, 0],
               [0, Y, B, 0],
               [0, 0, C, D],
               [0, 0, -1, 0]]);
}

//
// glOrtho
//
function makeOrtho(left, right, bottom, top, znear, zfar)
{
    var tx = - (right + left) / (right - left);
    var ty = - (top + bottom) / (top - bottom);
    var tz = - (zfar + znear) / (zfar - znear);

    return $M([[2 / (right - left), 0, 0, tx],
           [0, 2 / (top - bottom), 0, ty],
           [0, 0, -2 / (zfar - znear), tz],
           [0, 0, 0, 1]]);
}



