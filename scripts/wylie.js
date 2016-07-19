if (typeof define !== 'function') {  var define = require('amdefine')(module); } //for node.js
define([],function () {
var opt = { check:false, check_strict:false, print_warnings:false, fix_spacing:false }

function setopt(arg_opt) {
	for (i in arg_opt) opt[i] = arg_opt[i]
	if (opt.check_strict && !opt.check) { 
		throw 'check_strict requires check.'
	}
}

function newHashSet() {
	var x = []
	x.add = function (K) {
		if (this.indexOf(K) < 0) this.push(K)
	}
	x.contains = function (K) {
		return this.indexOf(K) >= 0
	}
	return x
}

function newHashMap() {
	var x = {}
	x.k = [], x.v = []
	x.put = function (K, V) {
		var i = this.k.indexOf(K)
		if (i < 0) this.k.push(K), this.v.push(V); else this.v[i] = V
	}
	x.containsKey = function (K) {
		return this.k.indexOf(K) >= 0
	}
	x.get = function (K) {
		var i = this.k.indexOf(K)
		if (i >= 0) return this.v[i]
	}
	return x
}
var tmpSet;
// mappings are ported from Java code
// *** Wylie to Unicode mappings ***
// list of wylie consonant => unicode
var m_consonant = new newHashMap();
m_consonant.put("k", 	"\u0f40");
m_consonant.put("kh", 	"\u0f41");
m_consonant.put("g", 	"\u0f42");
m_consonant.put("gh", 	"\u0f42\u0fb7");
m_consonant.put("g+h", 	"\u0f42\u0fb7");
m_consonant.put("ng", 	"\u0f44");
m_consonant.put("c", 	"\u0f45");
m_consonant.put("ch", 	"\u0f46");
m_consonant.put("j", 	"\u0f47");
m_consonant.put("ny", 	"\u0f49");
m_consonant.put("T", 	"\u0f4a");
m_consonant.put("-t", 	"\u0f4a");
m_consonant.put("Th", 	"\u0f4b");
m_consonant.put("-th", 	"\u0f4b");
m_consonant.put("D", 	"\u0f4c");
m_consonant.put("-d", 	"\u0f4c");
m_consonant.put("Dh", 	"\u0f4c\u0fb7");
m_consonant.put("D+h", 	"\u0f4c\u0fb7");
m_consonant.put("-dh", 	"\u0f4c\u0fb7");
m_consonant.put("-d+h", "\u0f4c\u0fb7");
m_consonant.put("N", 	"\u0f4e");
m_consonant.put("-n", 	"\u0f4e");
m_consonant.put("t", 	"\u0f4f");
m_consonant.put("th", 	"\u0f50");
m_consonant.put("d", 	"\u0f51");
m_consonant.put("dh", 	"\u0f51\u0fb7");
m_consonant.put("d+h", 	"\u0f51\u0fb7");
m_consonant.put("n", 	"\u0f53");
m_consonant.put("p", 	"\u0f54");
m_consonant.put("ph", 	"\u0f55");
m_consonant.put("b", 	"\u0f56");
m_consonant.put("bh", 	"\u0f56\u0fb7");
m_consonant.put("b+h", 	"\u0f56\u0fb7");
m_consonant.put("m", 	"\u0f58");
m_consonant.put("ts", 	"\u0f59");
m_consonant.put("tsh", 	"\u0f5a");
m_consonant.put("dz", 	"\u0f5b");
m_consonant.put("dzh", 	"\u0f5b\u0fb7");
m_consonant.put("dz+h", "\u0f5b\u0fb7");
m_consonant.put("w", 	"\u0f5d");
m_consonant.put("zh", 	"\u0f5e");
m_consonant.put("z", 	"\u0f5f");
m_consonant.put("'", 	"\u0f60");
m_consonant.put("\u2018", 	"\u0f60");	// typographic quotes
m_consonant.put("\u2019", 	"\u0f60");
m_consonant.put("y", 	"\u0f61");
m_consonant.put("r", 	"\u0f62");
m_consonant.put("l", 	"\u0f63");
m_consonant.put("sh", 	"\u0f64");
m_consonant.put("Sh", 	"\u0f65");
m_consonant.put("-sh", 	"\u0f65");
m_consonant.put("s", 	"\u0f66");
m_consonant.put("h", 	"\u0f67");
m_consonant.put("W", 	"\u0f5d");
m_consonant.put("Y", 	"\u0f61");
m_consonant.put("R", 	"\u0f6a");
m_consonant.put("f", 	"\u0f55\u0f39");
m_consonant.put("v", 	"\u0f56\u0f39");

// subjoined letters
var m_subjoined = new newHashMap();
m_subjoined.put("k", 	"\u0f90");
m_subjoined.put("kh", 	"\u0f91");
m_subjoined.put("g", 	"\u0f92");
m_subjoined.put("gh", 	"\u0f92\u0fb7");
m_subjoined.put("g+h", 	"\u0f92\u0fb7");
m_subjoined.put("ng", 	"\u0f94");
m_subjoined.put("c", 	"\u0f95");
m_subjoined.put("ch", 	"\u0f96");
m_subjoined.put("j", 	"\u0f97");
m_subjoined.put("ny", 	"\u0f99");
m_subjoined.put("T", 	"\u0f9a");
m_subjoined.put("-t", 	"\u0f9a");
m_subjoined.put("Th", 	"\u0f9b");
m_subjoined.put("-th", 	"\u0f9b");
m_subjoined.put("D", 	"\u0f9c");
m_subjoined.put("-d", 	"\u0f9c");
m_subjoined.put("Dh", 	"\u0f9c\u0fb7");
m_subjoined.put("D+h", 	"\u0f9c\u0fb7");
m_subjoined.put("-dh", 	"\u0f9c\u0fb7");
m_subjoined.put("-d+h",	"\u0f9c\u0fb7");
m_subjoined.put("N", 	"\u0f9e");
m_subjoined.put("-n", 	"\u0f9e");
m_subjoined.put("t", 	"\u0f9f");
m_subjoined.put("th", 	"\u0fa0");
m_subjoined.put("d", 	"\u0fa1");
m_subjoined.put("dh", 	"\u0fa1\u0fb7");
m_subjoined.put("d+h", 	"\u0fa1\u0fb7");
m_subjoined.put("n", 	"\u0fa3");
m_subjoined.put("p", 	"\u0fa4");
m_subjoined.put("ph", 	"\u0fa5");
m_subjoined.put("b", 	"\u0fa6");
m_subjoined.put("bh", 	"\u0fa6\u0fb7");
m_subjoined.put("b+h", 	"\u0fa6\u0fb7");
m_subjoined.put("m", 	"\u0fa8");
m_subjoined.put("ts", 	"\u0fa9");
m_subjoined.put("tsh", 	"\u0faa");
m_subjoined.put("dz", 	"\u0fab");
m_subjoined.put("dzh", 	"\u0fab\u0fb7");
m_subjoined.put("dz+h",	"\u0fab\u0fb7");
m_subjoined.put("w", 	"\u0fad");
m_subjoined.put("zh", 	"\u0fae");
m_subjoined.put("z", 	"\u0faf");
m_subjoined.put("'", 	"\u0fb0");
m_subjoined.put("\u2018", 	"\u0fb0");	// typographic quotes
m_subjoined.put("\u2019", 	"\u0fb0");
m_subjoined.put("y", 	"\u0fb1");
m_subjoined.put("r", 	"\u0fb2");
m_subjoined.put("l", 	"\u0fb3");
m_subjoined.put("sh", 	"\u0fb4");
m_subjoined.put("Sh", 	"\u0fb5");
m_subjoined.put("-sh", 	"\u0fb5");
m_subjoined.put("s", 	"\u0fb6");
m_subjoined.put("h", 	"\u0fb7");
m_subjoined.put("a", 	"\u0fb8");
m_subjoined.put("W", 	"\u0fba");
m_subjoined.put("Y", 	"\u0fbb");
m_subjoined.put("R", 	"\u0fbc");

// vowels
var m_vowel = new newHashMap();
m_vowel.put("a", 	"\u0f68");
m_vowel.put("A", 	"\u0f71");
m_vowel.put("i", 	"\u0f72");
m_vowel.put("I", 	"\u0f71\u0f72");
m_vowel.put("u", 	"\u0f74");
m_vowel.put("U", 	"\u0f71\u0f74");
m_vowel.put("e", 	"\u0f7a");
m_vowel.put("ai", 	"\u0f7b");
m_vowel.put("o", 	"\u0f7c");
m_vowel.put("au", 	"\u0f7d");
m_vowel.put("-i", 	"\u0f80");
m_vowel.put("-I", 	"\u0f71\u0f80");

// final symbols to unicode
var m_final_uni = new newHashMap();
m_final_uni.put("M", 	"\u0f7e");
m_final_uni.put("~M`", 	"\u0f82");
m_final_uni.put("~M", 	"\u0f83");
m_final_uni.put("X", 	"\u0f37");
m_final_uni.put("~X", 	"\u0f35");
m_final_uni.put("H", 	"\u0f7f");
m_final_uni.put("?", 	"\u0f84");
m_final_uni.put("^", 	"\u0f39");

// final symbols organized by class
var m_final_class = new newHashMap();
m_final_class.put("M", 	"M");
m_final_class.put("~M`", "M");
m_final_class.put("~M",  "M");
m_final_class.put("X", 	"X");
m_final_class.put("~X", "X");
m_final_class.put("H", 	"H");
m_final_class.put("?", 	"?");
m_final_class.put("^", 	"^");

// other stand-alone symbols
var m_other = new newHashMap();
m_other.put("0", 	"\u0f20");
m_other.put("1", 	"\u0f21");
m_other.put("2", 	"\u0f22");
m_other.put("3", 	"\u0f23");
m_other.put("4", 	"\u0f24");
m_other.put("5", 	"\u0f25");
m_other.put("6", 	"\u0f26");
m_other.put("7", 	"\u0f27");
m_other.put("8", 	"\u0f28");
m_other.put("9", 	"\u0f29");
m_other.put(" ", 	"\u0f0b");
m_other.put("*", 	"\u0f0c");
m_other.put("/", 	"\u0f0d");
m_other.put("//", 	"\u0f0e");
m_other.put(";", 	"\u0f0f");
m_other.put("|", 	"\u0f11");
m_other.put("!", 	"\u0f08");
m_other.put(":", 	"\u0f14");
m_other.put("_", 	" ");
m_other.put("=", 	"\u0f34");
m_other.put("<", 	"\u0f3a");
m_other.put(">", 	"\u0f3b");
m_other.put("(", 	"\u0f3c");
m_other.put(")", 	"\u0f3d");
m_other.put("@", 	"\u0f04");
m_other.put("#", 	"\u0f05");
m_other.put("$", 	"\u0f06");
m_other.put("%", 	"\u0f07");

// special characters: flag those if they occur out of context
var m_special = new newHashSet();
m_special.add(".");
m_special.add("+");
m_special.add("-");
m_special.add("~");
m_special.add("^");
m_special.add("?");
m_special.add("`");
m_special.add("]");

// superscripts: hashmap of superscript => set of letters or stacks below
var m_superscripts = new newHashMap();
tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("j");
tmpSet.add("ny");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("n");
tmpSet.add("b");
tmpSet.add("m");
tmpSet.add("ts");
tmpSet.add("dz");
tmpSet.add("k+y");
tmpSet.add("g+y");
tmpSet.add("m+y");
tmpSet.add("b+w");
tmpSet.add("ts+w");
tmpSet.add("g+w");
m_superscripts.put("r", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("c");
tmpSet.add("j");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("p");
tmpSet.add("b");
tmpSet.add("h");
m_superscripts.put("l", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("ny");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("n");
tmpSet.add("p");
tmpSet.add("b");
tmpSet.add("m");
tmpSet.add("ts");
tmpSet.add("k+y");
tmpSet.add("g+y");
tmpSet.add("p+y");
tmpSet.add("b+y");
tmpSet.add("m+y");
tmpSet.add("k+r");
tmpSet.add("g+r");
tmpSet.add("p+r");
tmpSet.add("b+r");
tmpSet.add("m+r");
tmpSet.add("n+r");
m_superscripts.put("s", tmpSet);

// subscripts => set of letters above
var m_subscripts = new newHashMap();
tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("kh");
tmpSet.add("g");
tmpSet.add("p");
tmpSet.add("ph");
tmpSet.add("b");
tmpSet.add("m");
tmpSet.add("r+k");
tmpSet.add("r+g");
tmpSet.add("r+m");
tmpSet.add("s+k");
tmpSet.add("s+g");
tmpSet.add("s+p");
tmpSet.add("s+b");
tmpSet.add("s+m");
m_subscripts.put("y", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("kh");
tmpSet.add("g");
tmpSet.add("t");
tmpSet.add("th");
tmpSet.add("d");
tmpSet.add("n");
tmpSet.add("p");
tmpSet.add("ph");
tmpSet.add("b");
tmpSet.add("m");
tmpSet.add("sh");
tmpSet.add("s");
tmpSet.add("h");
tmpSet.add("dz");
tmpSet.add("s+k");
tmpSet.add("s+g");
tmpSet.add("s+p");
tmpSet.add("s+b");
tmpSet.add("s+m");
tmpSet.add("s+n");
m_subscripts.put("r", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("b");
tmpSet.add("r");
tmpSet.add("s");
tmpSet.add("z");
m_subscripts.put("l", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("kh");
tmpSet.add("g");
tmpSet.add("c");
tmpSet.add("ny");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("ts");
tmpSet.add("tsh");
tmpSet.add("zh");
tmpSet.add("z");
tmpSet.add("r");
tmpSet.add("l");
tmpSet.add("sh");
tmpSet.add("s");
tmpSet.add("h");
tmpSet.add("g+r");
tmpSet.add("d+r");
tmpSet.add("ph+y");
tmpSet.add("r+g");
tmpSet.add("r+ts");
m_subscripts.put("w", tmpSet);

// prefixes => set of consonants or stacks after
var m_prefixes = new newHashMap();
tmpSet = new newHashSet();
tmpSet.add("c");
tmpSet.add("ny");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("n");
tmpSet.add("ts");
tmpSet.add("zh");
tmpSet.add("z");
tmpSet.add("y");
tmpSet.add("sh");
tmpSet.add("s");
m_prefixes.put("g", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("p");
tmpSet.add("b");
tmpSet.add("m");
tmpSet.add("k+y");
tmpSet.add("g+y");
tmpSet.add("p+y");
tmpSet.add("b+y");
tmpSet.add("m+y");
tmpSet.add("k+r");
tmpSet.add("g+r");
tmpSet.add("p+r");
tmpSet.add("b+r");
m_prefixes.put("d", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("c");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("ts");
tmpSet.add("zh");
tmpSet.add("z");
tmpSet.add("sh");
tmpSet.add("s");
tmpSet.add("r");
tmpSet.add("l");
tmpSet.add("k+y");
tmpSet.add("g+y");
tmpSet.add("k+r");
tmpSet.add("g+r");
tmpSet.add("r+l");
tmpSet.add("s+l");
tmpSet.add("r+k");
tmpSet.add("r+g");
tmpSet.add("r+ng");
tmpSet.add("r+j");
tmpSet.add("r+ny");
tmpSet.add("r+t");
tmpSet.add("r+d");
tmpSet.add("r+n");
tmpSet.add("r+ts");
tmpSet.add("r+dz");
tmpSet.add("s+k");
tmpSet.add("s+g");
tmpSet.add("s+ng");
tmpSet.add("s+ny");
tmpSet.add("s+t");
tmpSet.add("s+d");
tmpSet.add("s+n");
tmpSet.add("s+ts");
tmpSet.add("r+k+y");
tmpSet.add("r+g+y");
tmpSet.add("s+k+y");
tmpSet.add("s+g+y");
tmpSet.add("s+k+r");
tmpSet.add("s+g+r");
tmpSet.add("l+d");
tmpSet.add("l+t");
tmpSet.add("k+l");
tmpSet.add("s+r");
tmpSet.add("z+l");
tmpSet.add("s+w");
m_prefixes.put("b", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("kh");
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("ch");
tmpSet.add("j");
tmpSet.add("ny");
tmpSet.add("th");
tmpSet.add("d");
tmpSet.add("n");
tmpSet.add("tsh");
tmpSet.add("dz");
tmpSet.add("kh+y");
tmpSet.add("g+y");
tmpSet.add("kh+r");
tmpSet.add("g+r");
m_prefixes.put("m", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("kh");
tmpSet.add("g");
tmpSet.add("ch");
tmpSet.add("j");
tmpSet.add("th");
tmpSet.add("d");
tmpSet.add("ph");
tmpSet.add("b");
tmpSet.add("tsh");
tmpSet.add("dz");
tmpSet.add("kh+y");
tmpSet.add("g+y");
tmpSet.add("ph+y");
tmpSet.add("b+y");
tmpSet.add("kh+r");
tmpSet.add("g+r");
tmpSet.add("d+r");
tmpSet.add("ph+r");
tmpSet.add("b+r");
m_prefixes.put("'", tmpSet);
m_prefixes.put("\u2018", tmpSet);
m_prefixes.put("\u2019", tmpSet);

// set of suffix letters
// also included are some Skt letters b/c they occur often in suffix position in Skt words
var m_suffixes = new newHashSet();
m_suffixes.add("'");
m_suffixes.add("\u2018");
m_suffixes.add("\u2019");
m_suffixes.add("g");
m_suffixes.add("ng");
m_suffixes.add("d");
m_suffixes.add("n");
m_suffixes.add("b");
m_suffixes.add("m");
m_suffixes.add("r");
m_suffixes.add("l");
m_suffixes.add("s");
m_suffixes.add("N");
m_suffixes.add("T");
m_suffixes.add("-n");
m_suffixes.add("-t");

// suffix2 => set of letters before
var m_suff2 = new newHashMap();
tmpSet = new newHashSet();
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("b");
tmpSet.add("m");
m_suff2.put("s", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("n");
tmpSet.add("r");
tmpSet.add("l");
m_suff2.put("d", tmpSet);

// root letter index for very ambiguous three-stack syllables
var m_ambiguous_key = new newHashMap();
m_ambiguous_key.put("dgs", 	1);
m_ambiguous_key.put("dms", 	1);
m_ambiguous_key.put("'gs", 	1);
m_ambiguous_key.put("mngs", 	0);
m_ambiguous_key.put("bgs", 	0);
m_ambiguous_key.put("dbs", 	1);

var m_ambiguous_wylie = new newHashMap();
m_ambiguous_wylie.put("dgs", 	"dgas");
m_ambiguous_wylie.put("dms", 	"dmas");
m_ambiguous_wylie.put("'gs", 	"'gas");
m_ambiguous_wylie.put("mngs", 	"mangs");
m_ambiguous_wylie.put("bgs", 	"bags");
m_ambiguous_wylie.put("dbs", 	"dbas");

// *** Unicode to Wylie mappings ***

// top letters
var m_tib_top = new newHashMap();
m_tib_top.put('\u0f40', 	"k");
m_tib_top.put('\u0f41', 	"kh");
m_tib_top.put('\u0f42', 	"g");
m_tib_top.put('\u0f43', 	"g+h");
m_tib_top.put('\u0f44', 	"ng");
m_tib_top.put('\u0f45', 	"c");
m_tib_top.put('\u0f46', 	"ch");
m_tib_top.put('\u0f47', 	"j");
m_tib_top.put('\u0f49', 	"ny");
m_tib_top.put('\u0f4a', 	"T");
m_tib_top.put('\u0f4b', 	"Th");
m_tib_top.put('\u0f4c', 	"D");
m_tib_top.put('\u0f4d', 	"D+h");
m_tib_top.put('\u0f4e', 	"N");
m_tib_top.put('\u0f4f', 	"t");
m_tib_top.put('\u0f50', 	"th");
m_tib_top.put('\u0f51', 	"d");
m_tib_top.put('\u0f52', 	"d+h");
m_tib_top.put('\u0f53', 	"n");
m_tib_top.put('\u0f54', 	"p");
m_tib_top.put('\u0f55', 	"ph");
m_tib_top.put('\u0f56', 	"b");
m_tib_top.put('\u0f57', 	"b+h");
m_tib_top.put('\u0f58', 	"m");
m_tib_top.put('\u0f59', 	"ts");
m_tib_top.put('\u0f5a', 	"tsh");
m_tib_top.put('\u0f5b', 	"dz");
m_tib_top.put('\u0f5c', 	"dz+h");
m_tib_top.put('\u0f5d', 	"w");
m_tib_top.put('\u0f5e', 	"zh");
m_tib_top.put('\u0f5f', 	"z");
m_tib_top.put('\u0f60', 	"'");
m_tib_top.put('\u0f61', 	"y");
m_tib_top.put('\u0f62', 	"r");
m_tib_top.put('\u0f63', 	"l");
m_tib_top.put('\u0f64', 	"sh");
m_tib_top.put('\u0f65', 	"Sh");
m_tib_top.put('\u0f66', 	"s");
m_tib_top.put('\u0f67', 	"h");
m_tib_top.put('\u0f68', 	"a");
m_tib_top.put('\u0f69', 	"k+Sh");
m_tib_top.put('\u0f6a', 	"R");

// subjoined letters
var m_tib_subjoined = new newHashMap();
m_tib_subjoined.put('\u0f90', 	"k");
m_tib_subjoined.put('\u0f91', 	"kh");
m_tib_subjoined.put('\u0f92', 	"g");
m_tib_subjoined.put('\u0f93', 	"g+h");
m_tib_subjoined.put('\u0f94', 	"ng");
m_tib_subjoined.put('\u0f95', 	"c");
m_tib_subjoined.put('\u0f96', 	"ch");
m_tib_subjoined.put('\u0f97', 	"j");
m_tib_subjoined.put('\u0f99', 	"ny");
m_tib_subjoined.put('\u0f9a', 	"T");
m_tib_subjoined.put('\u0f9b', 	"Th");
m_tib_subjoined.put('\u0f9c', 	"D");
m_tib_subjoined.put('\u0f9d', 	"D+h");
m_tib_subjoined.put('\u0f9e', 	"N");
m_tib_subjoined.put('\u0f9f', 	"t");
m_tib_subjoined.put('\u0fa0', 	"th");
m_tib_subjoined.put('\u0fa1', 	"d");
m_tib_subjoined.put('\u0fa2', 	"d+h");
m_tib_subjoined.put('\u0fa3', 	"n");
m_tib_subjoined.put('\u0fa4', 	"p");
m_tib_subjoined.put('\u0fa5', 	"ph");
m_tib_subjoined.put('\u0fa6', 	"b");
m_tib_subjoined.put('\u0fa7', 	"b+h");
m_tib_subjoined.put('\u0fa8', 	"m");
m_tib_subjoined.put('\u0fa9', 	"ts");
m_tib_subjoined.put('\u0faa', 	"tsh");
m_tib_subjoined.put('\u0fab', 	"dz");
m_tib_subjoined.put('\u0fac', 	"dz+h");
m_tib_subjoined.put('\u0fad', 	"w");
m_tib_subjoined.put('\u0fae', 	"zh");
m_tib_subjoined.put('\u0faf', 	"z");
m_tib_subjoined.put('\u0fb0', 	"'");
m_tib_subjoined.put('\u0fb1', 	"y");
m_tib_subjoined.put('\u0fb2', 	"r");
m_tib_subjoined.put('\u0fb3', 	"l");
m_tib_subjoined.put('\u0fb4', 	"sh");
m_tib_subjoined.put('\u0fb5', 	"Sh");
m_tib_subjoined.put('\u0fb6', 	"s");
m_tib_subjoined.put('\u0fb7', 	"h");
m_tib_subjoined.put('\u0fb8', 	"a");
m_tib_subjoined.put('\u0fb9', 	"k+Sh");
m_tib_subjoined.put('\u0fba', 	"W");
m_tib_subjoined.put('\u0fbb', 	"Y");
m_tib_subjoined.put('\u0fbc', 	"R");

// vowel signs:
// a-chen is not here because that's a top character, not a vowel sign.
// pre-composed "I" and "U" are dealt here; other pre-composed Skt vowels are more
// easily handled by a global replace in toWylie(), b/c they turn into subjoined "r"/"l".

var m_tib_vowel = new newHashMap();
m_tib_vowel.put('\u0f71', 	"A");
m_tib_vowel.put('\u0f72', 	"i");
m_tib_vowel.put('\u0f73', 	"I");
m_tib_vowel.put('\u0f74', 	"u");
m_tib_vowel.put('\u0f75', 	"U");
m_tib_vowel.put('\u0f7a', 	"e");
m_tib_vowel.put('\u0f7b', 	"ai");
m_tib_vowel.put('\u0f7c', 	"o");
m_tib_vowel.put('\u0f7d', 	"au");
m_tib_vowel.put('\u0f80', 	"-i");

// long (Skt) vowels
var m_tib_vowel_long = new newHashMap();
m_tib_vowel_long.put("i", 	"I");
m_tib_vowel_long.put("u", 	"U");
m_tib_vowel_long.put("-i", 	"-I");

// final symbols => wylie
var m_tib_final_wylie = new newHashMap();
m_tib_final_wylie.put('\u0f7e', 	"M");
m_tib_final_wylie.put('\u0f82', 	"~M`");
m_tib_final_wylie.put('\u0f83', 	"~M");
m_tib_final_wylie.put('\u0f37', 	"X");
m_tib_final_wylie.put('\u0f35', 	"~X");
m_tib_final_wylie.put('\u0f39', 	"^");
m_tib_final_wylie.put('\u0f7f', 	"H");
m_tib_final_wylie.put('\u0f84', 	"?");

// final symbols by class
var m_tib_final_class = new newHashMap();
m_tib_final_class.put('\u0f7e', 	"M");
m_tib_final_class.put('\u0f82', 	"M");
m_tib_final_class.put('\u0f83', 	"M");
m_tib_final_class.put('\u0f37', 	"X");
m_tib_final_class.put('\u0f35', 	"X");
m_tib_final_class.put('\u0f39', 	"^");
m_tib_final_class.put('\u0f7f', 	"H");
m_tib_final_class.put('\u0f84', 	"?");

// special characters introduced by ^
var m_tib_caret = new newHashMap();
m_tib_caret.put("ph", 	"f");
m_tib_caret.put("b", 	"v");

// other stand-alone characters
var m_tib_other = new newHashMap();
m_tib_other.put(' ', 		"_");
m_tib_other.put('\u0f04', 	"@");
m_tib_other.put('\u0f05', 	"#");
m_tib_other.put('\u0f06', 	"$");
m_tib_other.put('\u0f07', 	"%");
m_tib_other.put('\u0f08', 	"!");
m_tib_other.put('\u0f0b', 	" ");
m_tib_other.put('\u0f0c', 	"*");
m_tib_other.put('\u0f0d', 	"/");
m_tib_other.put('\u0f0e', 	"//");
m_tib_other.put('\u0f0f', 	";");
m_tib_other.put('\u0f11', 	"|");
m_tib_other.put('\u0f14', 	":");
m_tib_other.put('\u0f20', 	"0");
m_tib_other.put('\u0f21', 	"1");
m_tib_other.put('\u0f22', 	"2");
m_tib_other.put('\u0f23', 	"3");
m_tib_other.put('\u0f24', 	"4");
m_tib_other.put('\u0f25', 	"5");
m_tib_other.put('\u0f26', 	"6");
m_tib_other.put('\u0f27', 	"7");
m_tib_other.put('\u0f28', 	"8");
m_tib_other.put('\u0f29', 	"9");
m_tib_other.put('\u0f34', 	"=");
m_tib_other.put('\u0f3a', 	"<");
m_tib_other.put('\u0f3b', 	">");
m_tib_other.put('\u0f3c', 	"(");
m_tib_other.put('\u0f3d', 	")");

// all these stacked consonant combinations don't need "+"s in them
var m_tib_stacks = new newHashSet();
m_tib_stacks.add("b+l");
m_tib_stacks.add("b+r");
m_tib_stacks.add("b+y");
m_tib_stacks.add("c+w");
m_tib_stacks.add("d+r");
m_tib_stacks.add("d+r+w");
m_tib_stacks.add("d+w");
m_tib_stacks.add("dz+r");
m_tib_stacks.add("g+l");
m_tib_stacks.add("g+r");
m_tib_stacks.add("g+r+w");
m_tib_stacks.add("g+w");
m_tib_stacks.add("g+y");
m_tib_stacks.add("h+r");
m_tib_stacks.add("h+w");
m_tib_stacks.add("k+l");
m_tib_stacks.add("k+r");
m_tib_stacks.add("k+w");
m_tib_stacks.add("k+y");
m_tib_stacks.add("kh+r");
m_tib_stacks.add("kh+w");
m_tib_stacks.add("kh+y");
m_tib_stacks.add("l+b");
m_tib_stacks.add("l+c");
m_tib_stacks.add("l+d");
m_tib_stacks.add("l+g");
m_tib_stacks.add("l+h");
m_tib_stacks.add("l+j");
m_tib_stacks.add("l+k");
m_tib_stacks.add("l+ng");
m_tib_stacks.add("l+p");
m_tib_stacks.add("l+t");
m_tib_stacks.add("l+w");
m_tib_stacks.add("m+r");
m_tib_stacks.add("m+y");
m_tib_stacks.add("n+r");
m_tib_stacks.add("ny+w");
m_tib_stacks.add("p+r");
m_tib_stacks.add("p+y");
m_tib_stacks.add("ph+r");
m_tib_stacks.add("ph+y");
m_tib_stacks.add("ph+y+w");
m_tib_stacks.add("r+b");
m_tib_stacks.add("r+d");
m_tib_stacks.add("r+dz");
m_tib_stacks.add("r+g");
m_tib_stacks.add("r+g+w");
m_tib_stacks.add("r+g+y");
m_tib_stacks.add("r+j");
m_tib_stacks.add("r+k");
m_tib_stacks.add("r+k+y");
m_tib_stacks.add("r+l");
m_tib_stacks.add("r+m");
m_tib_stacks.add("r+m+y");
m_tib_stacks.add("r+n");
m_tib_stacks.add("r+ng");
m_tib_stacks.add("r+ny");
m_tib_stacks.add("r+t");
m_tib_stacks.add("r+ts");
m_tib_stacks.add("r+ts+w");
m_tib_stacks.add("r+w");
m_tib_stacks.add("s+b");
m_tib_stacks.add("s+b+r");
m_tib_stacks.add("s+b+y");
m_tib_stacks.add("s+d");
m_tib_stacks.add("s+g");
m_tib_stacks.add("s+g+r");
m_tib_stacks.add("s+g+y");
m_tib_stacks.add("s+k");
m_tib_stacks.add("s+k+r");
m_tib_stacks.add("s+k+y");
m_tib_stacks.add("s+l");
m_tib_stacks.add("s+m");
m_tib_stacks.add("s+m+r");
m_tib_stacks.add("s+m+y");
m_tib_stacks.add("s+n");
m_tib_stacks.add("s+n+r");
m_tib_stacks.add("s+ng");
m_tib_stacks.add("s+ny");
m_tib_stacks.add("s+p");
m_tib_stacks.add("s+p+r");
m_tib_stacks.add("s+p+y");
m_tib_stacks.add("s+r");
m_tib_stacks.add("s+t");
m_tib_stacks.add("s+ts");
m_tib_stacks.add("s+w");
m_tib_stacks.add("sh+r");
m_tib_stacks.add("sh+w");
m_tib_stacks.add("t+r");
m_tib_stacks.add("t+w");
m_tib_stacks.add("th+r");
m_tib_stacks.add("ts+w");
m_tib_stacks.add("tsh+w");
m_tib_stacks.add("z+l");
m_tib_stacks.add("z+w");
m_tib_stacks.add("zh+w");

// a map used to split the input string into tokens for fromWylie().
// all letters which start tokens longer than one letter are mapped to the max length of
// tokens starting with that letter.  
var m_tokens_start = new newHashMap();
m_tokens_start.put('S', 2);
m_tokens_start.put('/', 2);
m_tokens_start.put('d', 4);
m_tokens_start.put('g', 3);
m_tokens_start.put('b', 3);
m_tokens_start.put('D', 3);
m_tokens_start.put('z', 2);
m_tokens_start.put('~', 3);
m_tokens_start.put('-', 4);
m_tokens_start.put('T', 2);
m_tokens_start.put('a', 2);
m_tokens_start.put('k', 2);
m_tokens_start.put('t', 3);
m_tokens_start.put('s', 2);
m_tokens_start.put('c', 2);
m_tokens_start.put('n', 2);
m_tokens_start.put('p', 2);
m_tokens_start.put('\r', 2);

// also for tokenization - a set of tokens longer than one letter
var m_tokens = new newHashSet();
m_tokens.add("-d+h");
m_tokens.add("dz+h");
m_tokens.add("-dh");
m_tokens.add("-sh");
m_tokens.add("-th");
m_tokens.add("D+h");
m_tokens.add("b+h");
m_tokens.add("d+h");
m_tokens.add("dzh");
m_tokens.add("g+h");
m_tokens.add("tsh");
m_tokens.add("~M`");
m_tokens.add("-I");
m_tokens.add("-d");
m_tokens.add("-i");
m_tokens.add("-n");
m_tokens.add("-t");
m_tokens.add("//");
m_tokens.add("Dh");
m_tokens.add("Sh");
m_tokens.add("Th");
m_tokens.add("ai");
m_tokens.add("au");
m_tokens.add("bh");
m_tokens.add("ch");
m_tokens.add("dh");
m_tokens.add("dz");
m_tokens.add("gh");
m_tokens.add("kh");
m_tokens.add("ng");
m_tokens.add("ny");
m_tokens.add("ph");
m_tokens.add("sh");
m_tokens.add("th");
m_tokens.add("ts");
m_tokens.add("zh");
m_tokens.add("~M");
m_tokens.add("~X");
m_tokens.add("\r\n");

// A class to encapsulate the return value of fromWylieOneStack.
var WylieStack = function() {
	this.uni_string = ''
	this.tokens_used = 0
	this.single_consonant = ''
	this.single_cons_a = ''
	this.warns = []
	this.visarga = false
	return this
}

// Looking from i onwards within tokens, returns as many consonants as it finds,
// up to and not including the next vowel or punctuation.  Skips the caret "^".
// Returns: a string of consonants joined by "+" signs.
function consonantString(tokens, i) { // strings, int
	var out = [];
	var t = '';
	while (tokens[i] != null) {
		t = tokens[i++];
		if (t == '+' || t == '^') continue;
		if (consonant(t) == null) break;
		out.push(t);
	}
	return out.join("+");
}

// Looking from i backwards within tokens, at most up to orig_i, returns as 
// many consonants as it finds, up to and not including the next vowel or
// punctuation.  Skips the caret "^".
// Returns: a string of consonants (in forward order) joined by "+" signs.
function consonantStringBackwards(tokens, i, orig_i) {
	var out = [];
	var t = '';
	while (i >= orig_i && tokens[i] != null) {
		t = tokens[i--];
		if (t == '+' || t == '^') continue;
		if (consonant(t) == null) break;
		out.unshift(t);
	}
	return out.join("+");
}

// A class to encapsulate the return value of fromWylieOneTsekbar.
var WylieTsekbar = function() {
	this.uni_string = ''
	this.tokens_used = 0
	this.warns = []
	return this
}
// A class to encapsulate an analyzed tibetan stack, while converting Unicode to Wylie.
var ToWylieStack = function() {
	this.top = ''
	this.stack = []
	this.caret = false
	this.vowels = []
	this.finals = []
	this.finals_found = newHashMap()
	this.visarga = false
	this.cons_str = ''
	this.single_cons = ''
	this.prefix = false
	this.suffix = false
	this.suff2 = false
	this.dot = false
	this.tokens_used = 0
	this.warns = []
	return this
}

// A class to encapsulate the return value of toWylieOneTsekbar.
var ToWylieTsekbar = function() {
	this.wylie = ''
	this.tokens_used = 0
	this.warns = []
	return this
}

// Converts successive stacks of Wylie into unicode, starting at the given index
// within the array of tokens. 
// 
// Assumes that the first available token is valid, and is either a vowel or a consonant.
// Returns a WylieTsekbar object
// HELPER CLASSES AND STRUCTURES
var State = { PREFIX: 0, MAIN: 1, SUFF1: 2, SUFF2: 3, NONE: 4 }
	// split a string into Wylie tokens; 
	// make sure there is room for at least one null element at the end of the array
var splitIntoTokens = function(str) {
	var tokens = [] // size = str.length + 2
	var i = 0;
	var maxlen = str.length;
	TOKEN:
	while (i < maxlen) {
		var c = str.charAt(i);
		var mlo = m_tokens_start.get(c);
		// if there are multi-char tokens starting with this char, try them
		if (mlo != null) {
			for (var len = mlo; len > 1; len--) {
				if (i <= maxlen - len) {
					var tr = str.substring(i, i + len);
					if (m_tokens.contains(tr)) {
						tokens.push(tr);
						i += len;
						continue TOKEN;
					}
				}
			}
		}
		// things starting with backslash are special
		if (c == '\\' && i <= maxlen - 2) {
			if (str.charAt(i + 1) == 'u' && i <= maxlen - 6) {
				tokens.push(str.substring(i, i + 6));		// \\uxxxx
				i += 6;
			} else if (str.charAt(i + 1) == 'U' && i <= maxlen - 10) {
				tokens.push(str.substring(i, i + 10));		// \\Uxxxxxxxx
				i += 10;
			} else {
				tokens.push(str.substring(i, i + 2));		// \\x
				i += 2;
			}
			continue TOKEN;
		}
		// otherwise just take one char
		tokens.push(c.toString());
		i += 1;
	}
	return tokens;
}

// helper functions to access the various hash tables
var consonant = function(s) { return m_consonant.get(s) }
var subjoined = function(s) { return m_subjoined.get(s) }
var vowel = function(s) { return m_vowel.get(s) }
var final_uni = function(s) { return m_final_uni.get(s) }
var final_class = function(s) { return m_final_class.get(s) }
var other = function(s) { return m_other.get(s) }
var isSpecial = function(s) { return m_special.contains(s) }
var isSuperscript = function(s) { return m_superscripts.containsKey(s) }
var superscript = function(sup, below) {
	var tmpSet = m_superscripts.get(sup);
	if (tmpSet == null) return false;
	return tmpSet.contains(below);
}
var isSubscript = function(s) { return m_subscripts.containsKey(s) }
var subscript = function(sub, above) {
	var tmpSet = m_subscripts.get(sub);
	if (tmpSet == null) return false;
	return tmpSet.contains(above);
}
var isPrefix = function(s) { return m_prefixes.containsKey(s) }
var prefix = function(pref, after) {
	var tmpSet = m_prefixes.get(pref);
	if (tmpSet == null) return false;
	return tmpSet.contains(after);
}
var isSuffix = function(s) { return m_suffixes.contains(s) }
var isSuff2 = function(s) { return m_suff2.containsKey(s) }
var suff2 = function(suff, before) {
	var tmpSet = m_suff2.get(suff);
	if (tmpSet == null) return false;
	return tmpSet.contains(before);
}
var ambiguous_key = function(syll) { return m_ambiguous_key.get(syll) }
var ambiguous_wylie = function(syll) { return m_ambiguous_wylie.get(syll) }
var tib_top = function(c) { return m_tib_top.get(c) }
var tib_subjoined = function(c) { return m_tib_subjoined.get(c) }
var tib_vowel = function(c) { return m_tib_vowel.get(c) }
var tib_vowel_long = function(s) { return m_tib_vowel_long.get(s) }
var tib_final_wylie = function(c) { return m_tib_final_wylie.get(c) }
var tib_final_class = function(c) { return m_tib_final_class.get(c) }
var tib_caret = function(s) { return m_tib_caret.get(s) }
var tib_other = function(c) { return m_tib_other.get(c) }
var tib_stack = function(s) { return m_tib_stacks.contains(s) }

// does this string consist of only hexadecimal digits?
function validHex(t) {
	for (var i = 0; i < t.length; i++) {
		var c = t.charAt(i);
		if (!((c >= 'a' && c <= 'f') || (c >= '0' && c <= '9'))) return false;
	}
	return true;
}

// generate a warning if we are keeping them; prints it out if we were asked to
// handle a Wylie unicode escape, \\uxxxx or \\Uxxxxxxxx
function unicodeEscape (warns, line, t) { // [], int, str
	var hex = t.substring(2);
	if (hex == '') return null;
	if (!validHex(hex)) {
		warnl(warns, line, "\"" + t + "\": invalid hex code.");
		return "";
	}
	return String.fromCharCode(parseInt(hex, 16))
}

function warn(warns, str) {
	if (warns != null) warns.push(str);
	if (opt.print_warnings) console.log(str);
}

// warn with line number
function warnl(warns, line, str) {
	warn(warns, "line " + line + ": " + str);
}

function fromWylieOneTsekbar(tokens, i) { // (str, int)
	var orig_i = i
	var t = tokens[i]
	// variables for tracking the state within the syllable as we parse it
	var stack = null
	var prev_cons = ''
	var visarga = false
	// variables for checking the root letter, after parsing a whole tsekbar made of only single
	// consonants and one consonant with "a" vowel
	var check_root = true
	var consonants = [] // strings
	var root_idx = -1
	var out = ''
	var warns = []
	// the type of token that we are expecting next in the input stream
	//   - PREFIX : expect a prefix consonant, or a main stack
	//   - MAIN   : expect only a main stack
	//   - SUFF1  : expect a 1st suffix 
	//   - SUFF2  : expect a 2nd suffix
	//   - NONE   : expect nothing (after a 2nd suffix)
	//
	// the state machine is actually more lenient than this, in that a "main stack" is allowed
	// to come at any moment, even after suffixes.  this is because such syllables are sometimes
	// found in abbreviations or other places.  basically what we check is that prefixes and 
	// suffixes go with what they are attached to.
	//
	// valid tsek-bars end in one of these states: SUFF1, SUFF2, NONE
	var state = State.PREFIX;

	// iterate over the stacks of a tsek-bar
	STACK:
	while (t != null && (vowel(t) != null || consonant(t) != null) && !visarga) {
		// translate a stack
		if (stack != null) prev_cons = stack.single_consonant;
		stack = fromWylieOneStack(tokens, i);
		i += stack.tokens_used;
		t = tokens[i];
		out += stack.uni_string;
		warns = warns.concat(stack.warns);
		visarga = stack.visarga;
		if (!opt.check) continue;
		// check for syllable structure consistency by iterating a simple state machine
		// - prefix consonant
		if (state == State.PREFIX && stack.single_consonant != null) {
			consonants.push(stack.single_consonant);
			if (isPrefix(stack.single_consonant)) {
			var next = t;
			if (opt.check_strict) next = consonantString(tokens, i);
			if (next != null && !prefix(stack.single_consonant, next)) {
				next = next.replace(/\+/g, "");
				warns.push("Prefix \"" + stack.single_consonant + "\" does not occur before \"" + next + "\".");
			}
		} else {
			warns.push("Invalid prefix consonant: \"" + stack.single_consonant + "\".");
		}
		state = State.MAIN;
		// - main stack with vowel or multiple consonants
		} else if (stack.single_consonant == null) {
		state = State.SUFF1;
		// keep track of the root consonant if it was a single cons with an "a" vowel
		if (root_idx >= 0) {
			check_root = false;
		} else if (stack.single_cons_a != null) {
			consonants.push(stack.single_cons_a);
			root_idx = consonants.length - 1;
		}
		// - unexpected single consonant after prefix
		} else if (state == State.MAIN) {
			warns.push("Expected vowel after \"" + stack.single_consonant + "\".");
			// - 1st suffix
		} else if (state == State.SUFF1) {
			consonants.push(stack.single_consonant);
			// check this one only in strict mode b/c it trips on lots of Skt stuff
			if (opt.check_strict) {
				if (!isSuffix(stack.single_consonant)) {
					warns.push("Invalid suffix consonant: \"" + stack.single_consonant + "\".");
				}
			}
			state = State.SUFF2;
			// - 2nd suffix
		} else if (state == State.SUFF2) {
			consonants.push(stack.single_consonant);
			if (isSuff2(stack.single_consonant)) {
				if (!suff2(stack.single_consonant, prev_cons)) {
					warns.push("Second suffix \"" + stack.single_consonant 
					+ "\" does not occur after \"" + prev_cons + "\".");
				}
			} else {
				warns.push("Invalid 2nd suffix consonant: \"" + stack.single_consonant  + "\".");
			}
			state = State.NONE;
			// - more crap after a 2nd suffix
		} else if (state == State.NONE) {
			warns.push("Cannot have another consonant \"" + stack.single_consonant + "\" after 2nd suffix.");
		}
	}

	if (state == State.MAIN && stack.single_consonant != null && isPrefix(stack.single_consonant)) {
	warns.push("Vowel expected after \"" + stack.single_consonant + "\".");
	}

	// check root consonant placement only if there were no warnings so far, and the syllable 
	// looks ambiguous.  not many checks are needed here because the previous state machine 
	// already takes care of most illegal combinations.
	if (opt.check && warns.length == 0 && check_root && root_idx >= 0) {
		// 2 letters where each could be prefix/suffix: root is 1st
		if (consonants.length == 2 && root_idx != 0 
		&& prefix(consonants[0], consonants[1]) && isSuffix(consonants[1]))
		{
			warns.push("Syllable should probably be \"" + consonants[0] + "a" + consonants[1] + "\".");

			// 3 letters where 1st can be prefix, 2nd can be postfix before "s" and last is "s":
			// use a lookup table as this is completely ambiguous.
		} else if (consonants.length == 3 && isPrefix(consonants[0]) &&
			suff2("s", consonants[1]) && consonants[2] == "s")
		{
			var cc = consonants.join("");
			cc = cc.replace(/\u2018/g, '\'');
			cc = cc.replace(/\u2019/g, '\'');	// typographical quotes
			var expect_key = ambiguous_key(cc);
	//		console.log('typeof expect_key', typeof expect_key)
			if (expect_key != null && expect_key != root_idx) {
				warns.push("Syllable should probably be \"" + ambiguous_wylie(cc) + "\".");
			}
		}
	}
	// return the stuff as a WylieTsekbar struct
	var ret = new WylieTsekbar();
	ret.uni_string = out;
	ret.tokens_used = i - orig_i;
	ret.warns = warns;
	return ret;
}

    // Converts one stack's worth of Wylie into unicode, starting at the given index
    // within the array of tokens.
    // Assumes that the first available token is valid, and is either a vowel or a consonant.
    // Returns a WylieStack object.
function fromWylieOneStack(tokens, i) {
	var orig_i = i
	var t = '', t2 = '', o = ''
	var out = ''
	var warns = []
	var consonants = 0		// how many consonants found
	var vowel_found = null; // any vowels (including a-chen)
	var vowel_sign = null; // any vowel signs (that go under or above the main stack)
	var single_consonant = null; // did we find just a single consonant?
	var plus = false;		// any explicit subjoining via '+'?
	var caret = 0;			// find any '^'?
	var final_found = new newHashMap(); // keep track of finals (H, M, etc) by class

	// do we have a superscript?
	t = tokens[i]
	t2 = tokens[i + 1]
	if (t2 != null && isSuperscript(t) && superscript(t, t2)) {
		if (opt.check_strict) {
			var next = consonantString(tokens, i + 1);
			if (!superscript(t, next)) {
				next = next.replace(/\+/g, '')
				warns.push("Superscript \"" + t + "\" does not occur above combination \"" + next + "\".");
			}
		}
		out += consonant(t);
		consonants++;
		i++;
		while (tokens[i] != null && tokens[i] == ("^")) { caret++; i++; }
	}
	// main consonant + stuff underneath.
	// this is usually executed just once, but the "+" subjoining operator makes it come back here
	MAIN: 
	while (true) {
		// main consonant (or a "a" after a "+")
		t = tokens[i];
		if (consonant(t) != null || (out.length > 0 && subjoined(t) != null)) {
			if (out.length > 0) {
				out += (subjoined(t));
			} else {
				out += (consonant(t));
			}
			i++;

			if (t == "a") {
				vowel_found = "a";
			} else {
				consonants++;
				single_consonant = t;
			}

			while (tokens[i] != null && tokens[i] == "^") {
				caret++;
				i++;
			}
			// subjoined: rata, yata, lata, wazur.  there can be up two subjoined letters in a stack.
			for (var z = 0; z < 2; z++) {
				t2 = tokens[i];
				if (t2 != null && isSubscript(t2)) {
					// lata does not occur below multiple consonants 
					// (otherwise we mess up "brla" = "b.r+la")
					if (t2 == "l" && consonants > 1) break;
					// full stack checking (disabled by "+")
					if (opt.check_strict && !plus) {
						var prev = consonantStringBackwards(tokens, i-1, orig_i);
						if (!subscript(t2, prev)) {
							prev = prev.replace(/\+/g, "");
							warns.push("Subjoined \"" + t2 + "\" not expected after \"" + prev + "\".");
						}
						// simple check only
					} else if (opt.check) {
						if (!subscript(t2, t) && !(z == 1 && t2 == ("w") && t == ("y"))) {
							warns.push("Subjoined \"" + t2 + "\"not expected after \"" + t + "\".");
						}
					}
					out += subjoined(t2);
					i++;
					consonants++;
					while (tokens[i] != null && tokens[i] == ("^")) { caret++; i++; }
					t = t2;
				} else {
					break;
				}
			}
		}

		// caret (^) can come anywhere in Wylie but in Unicode we generate it at the end of 
		// the stack but before vowels if it came there (seems to be what OpenOffice expects),
		// or at the very end of the stack if that's how it was in the Wylie.
		if (caret > 0) {
			if (caret > 1) {
				warns.push("Cannot have more than one \"^\" applied to the same stack.");
			}
			final_found.put(final_class("^"), "^");
			out += (final_uni("^"));
			caret = 0;
		}
		// vowel(s)
		t = tokens[i];
		if (t != null && vowel(t) != null) {
			if (out.length == 0) out += (vowel("a"));
			if (t != "a") out += (vowel(t));
			i++;
			vowel_found = t;
			if (t != "a") vowel_sign = t;
		}
		// plus sign: forces more subjoining
		t = tokens[i];
		if (t != null && t == ("+")) {
			i++;
			plus = true;
			// sanity check: next token must be vowel or subjoinable consonant.  
			t = tokens[i];
			if (t == null || (vowel(t) == null && subjoined(t) == null)) {
				if (opt.check) warns.push("Expected vowel or consonant after \"+\".");
				break MAIN;
			}
			// consonants after vowels doesn't make much sense but process it anyway
			if (opt.check) {
				if (vowel(t) == null && vowel_sign != null) {
					warns.push("Cannot subjoin consonant (" + t + ") after vowel (" + vowel_sign + ") in same stack.");
				} else if (t == ("a") && vowel_sign != null) {
					warns.push("Cannot subjoin a-chen (a) after vowel (" + vowel_sign + ") in same stack.");
				}
			}
			continue MAIN;
		}
		break MAIN;
	}
	// final tokens
	t = tokens[i];
	while (t != null && final_class(t) != null) {
		var uni = final_uni(t);
		var klass = final_class(t);
		// check for duplicates
		if (final_found.containsKey(klass)) {
			if (final_found.get(klass) == t) {
				warns.push("Cannot have two \"" + t + "\" applied to the same stack.");
			} else {
				warns.push("Cannot have \"" + t + "\" and \"" + final_found.get(klass)
					+ "\" applied to the same stack.");
			}
		} else {
			final_found.put(klass, t);
			out += (uni);
		}
		i++;
		single_consonant = null;
		t = tokens[i];
	}
	// if next is a dot "." (stack separator), skip it.
	if (tokens[i] != null && tokens[i] == (".")) i++;
	// if we had more than a consonant and no vowel, and no explicit "+" joining, backtrack and 
	// return the 1st consonant alone
	if (consonants > 1 && vowel_found == null) {
		if (plus) {
			if (opt.check) warns.push("Stack with multiple consonants should end with vowel.");
		} else {
			i = orig_i + 1;
			consonants = 1;
			single_consonant = tokens[orig_i];
			out = '';
			out += (consonant(single_consonant));
		}
	}
	// calculate "single consonant"
	if (consonants != 1 || plus) {
		single_consonant = null;
	}
	// return the stuff as a WylieStack struct
	var ret = new WylieStack();
	ret.uni_string = out;
	ret.tokens_used = i - orig_i;
	if (vowel_found != null) {
		ret.single_consonant = null;
	} else {
		ret.single_consonant = single_consonant;
	}

	if (vowel_found != null && vowel_found == ("a")) {
		ret.single_cons_a = single_consonant;
	} else {
		ret.single_cons_a = null;
	}
	ret.warns = warns;
	ret.visarga = final_found.containsKey("H");
	return ret;
}

	// Converts a Wylie (EWTS) string to unicode.  If 'warns' is not 'null', puts warnings into it.
function fromWylie(str, warns) {
		var out = '', line = 1, units = 0, i = 0
		if (opt.fix_spacing) { str = str.replace(/^\s+/, '') }
		var tokens = splitIntoTokens(str);
		ITER:while (tokens[i] != null) {
			var t = tokens[i], o = null
			// [non-tibetan text] : pass through, nesting brackets
			if (t == "[") {
				var nesting = 1;
				i++;
					ESC:while (tokens[i] != null) {
					t = tokens[i++];
					if (t == "[") nesting++;
					if (t == "]") nesting--;
					if (nesting == 0) continue ITER;
					// handle unicode escapes and \1-char escapes within [comments]...
					if (t.charAt(0) == '\\' && (t.charAt(1) == 'u' || t.charAt(1) == 'U')) {
						o = unicodeEscape(warns, line, t);
						if (o != null) {
							out += o;
							continue ESC;
						}
					}
					if (t.charAt(0) == '\\') {
						o = t.substring(1);
					} else {
						o = t;
					}
					out += o;
				}
				warnl(warns, line, "Unfinished [non-Wylie stuff].");
				break ITER;
			}
			// punctuation, numbers, etc
			o = other(t);
			if (o != null) {
				out += o;
				i++;
				units++;
				// collapse multiple spaces?
				if (t == " " && opt.fix_spacing) {
					while (tokens[i] != null && tokens[i] == " ") i++;
				}
				continue ITER;
			}
			// vowels & consonants: process tibetan script up to a tsek, punctuation or line noise
			if (vowel(t) != null || consonant(t) != null) {
				var tb = fromWylieOneTsekbar(tokens, i);
				var word = '';
				for (var j = 0; j < tb.tokens_used; j++) {
					word += (tokens[i+j]);
				}
				out += tb.uni_string;
				i += tb.tokens_used;
				units++;
				for (var w = 0; w < tb.warns.length; w++) {
					warnl(warns, line, "\"" + word + "\": " + tb.warns[w]);
				}
				continue ITER;
			}
			// *** misc unicode and line handling stuff ***
			// ignore BOM and zero-width space
			if (t == "\ufeff" || t == "\u200b") {
				i++;
				continue ITER;
			}
			// \\u, \\U unicode characters
			if (t.charAt(0) == '\\' && (t.charAt(1) == 'u' || t.charAt(1) == 'U')) {
				o = unicodeEscape(warns, line, t);
				if (o != null) {
					i++;
					out += o;
					continue ITER;
				}
			}
			// backslashed characters
			if (t.charAt(0) == '\\') {
				out += t.substring(1);
				i++;
				continue ITER;
			}
			// count lines
			if (t == "\r\n" || t == "\n" || t == "\r") {
				line++;
				out += t;
				i++;
				// also eat spaces after newlines (optional)
				if (opt.fix_spacing) {
					while (tokens[i] != null && tokens[i] == " ") i++;
				}
				continue ITER;
			}
			// stuff that shouldn't occur out of context: special chars and remaining [a-zA-Z]
			var c = t.charAt(0);
			if (isSpecial(t) || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
				warnl(warns, line, "Unexpected character \"" + t + "\".");
			}
			// anything else: pass through
			out += t;
			i++;
		}
		if (units == 0) warn(warns, "No Tibetan characters found!");
		return out
	}
	
	// given a character, return a string like "\\uxxxx", with its code in hex
function formatHex(t) { //char
		// not compatible with GWT...
		// return String.format("\\u%04x", (int)t);
		var sb = '';
		sb += '\\u';
		var s = t.charCodeAt(0).toString(16);
		for (var i = s.length; i < 4; i++) sb += '0';
		sb += s;
		return sb;
	}

	// handles spaces (if any) in the input stream, turning them into '_'.
	// this is abstracted out because in non-escaping mode, we only want to turn spaces into _
	// when they come in the middle of Tibetan script.
function handleSpaces(str, i, out) { //return int
	var found = 0;
	var orig_i = i;
	while (i < str.length && str.charAt(i) == ' ') {
		i++;
		found++;
	}
	if (found == 0 || i == str.length) return 0;
	var t = str.charAt(i);
	if (tib_top(t) == null && tib_other(t) == null) return 0;
	// found 'found' spaces between two tibetan bits; generate the same number of '_'s
	for (i = 0; i < found; i++) out += '_';
	return found;
}

// for space-handling in escaping mode: is the next thing coming (after a number of spaces)
// some non-tibetan bit, within the same line?
function followedByNonTibetan(str, i) {
	var len = str.length;
	while (i < len && str.charAt(i) == ' ') i++;
	if (i == len) return false;
	var t = str.charAt(i);
	return tib_top(t) == null && tib_other(t) == null && t != '\r' && t != '\n';
}

// Convert Unicode to Wylie: one tsekbar
function toWylieOneTsekbar(str, len, i) {
	var orig_i = i;
	var warns = [];
	var stacks = [];// ArrayList<ToWylieStack>;
	ITER: 
	while (true) {
		var st = toWylieOneStack(str, len, i);
		stacks.push(st);
		warns = warns.concat(st.warns);
		i += st.tokens_used;
		if (st.visarga) break ITER;
		if (i >= len || tib_top(str.charAt(i)) == null) break ITER;
	}
	// figure out if some of these stacks can be prefixes or suffixes (in which case
	// they don't need their "a" vowels)
	var last = stacks.length - 1;
	if (stacks.length > 1 && stacks[0].single_cons != null) {
		// we don't count the wazur in the root stack, for prefix checking
		var cs = stacks[1].cons_str.replace(/\+w/g, "")
		if (prefix(stacks[0].single_cons, cs)) stacks[0].prefix = true;
	}
	if (stacks.length > 1 && stacks[last].single_cons != null 
	&& isSuffix(stacks[last].single_cons)) {
		stacks[last].suffix = true;
	}
	if (stacks.length > 2 && stacks[last].single_cons != null 
	&& stacks[last - 1].single_cons != null
	&& isSuffix(stacks[last - 1].single_cons)
	&& suff2(stacks[last].single_cons, stacks[last - 1].single_cons)) {
		stacks[last].suff2 = true;
		stacks[last - 1].suffix = true;
	}
	// if there are two stacks and both can be prefix-suffix, then 1st is root
	if (stacks.length == 2 && stacks[0].prefix && stacks[1].suffix) {
	    stacks[0].prefix = false;
	}
	// if there are three stacks and they can be prefix, suffix and suff2, then check w/ a table
	if (stacks.length == 3 && stacks[0].prefix && stacks[1].suffix && stacks[2].suff2) {
		var strb = []
		for (var si = 0; si < stacks.length; si++) strb.push(stacks[si].single_cons)
		var ztr = strb.join('')
		var root = ambiguous_key(ztr)
		if (root == null) {
			warns.push("Ambiguous syllable found: root consonant not known for \"" + ztr + "\".")
			// make it up...  (ex. "mgas" for ma, ga, sa)
			root = 1
		}
		stacks[root].prefix = stacks[root].suffix = false
		stacks[root + 1].suff2 = false
	}
	// if the prefix together with the main stack could be mistaken for a single stack, add a "."
	if (stacks[0].prefix && tib_stack(stacks[0].single_cons + "+" + stacks[1].cons_str)) 
		stacks[0].dot = true;
	// put it all together
	var out = ''
	for (var si = 0; si < stacks.length; si++) out += putStackTogether(stacks[si])
	var ret = new ToWylieTsekbar();
	ret.wylie = out;
	ret.tokens_used = i - orig_i;
	ret.warns = warns;
	return ret;
}
	 
// Unicode to Wylie: one stack at a time
function toWylieOneStack(str, len, i) {
	var orig_i = i;
	var ffinal = null, vowel = null, klass = null;
	// split the stack into a ToWylieStack object:
	//   - top symbol
	//   - stacked signs (first is the top symbol again, then subscribed main characters...)
	//   - caret (did we find a stray tsa-phru or not?)
	//   - vowel signs (including small subscribed a-chung, "-i" Skt signs, etc)
	//   - final stuff (including anusvara, visarga, halanta...)
	//   - and some more variables to keep track of what has been found
	var st = new ToWylieStack();
	// assume: tib_top(t) exists
	var t = str.charAt(i++);
	st.top = tib_top(t);
	st.stack.push(tib_top(t));
	// grab everything else below the top sign and classify in various categories
	while (i < len) {
		t = str.charAt(i);
		var o;
		if ((o = tib_subjoined(t)) != null) {
			i++;
			st.stack.push(o);
			// check for bad ordering
			if (st.finals.length > 0) {
				st.warns.push("Subjoined sign \"" + o + "\" found after final sign \"" + ffinal + "\".");
			} else if (st.vowels.length > 0) {
				st.warns.push("Subjoined sign \"" + o + "\" found after vowel sign \"" + vowel + "\".");
			}
		} else if ((o = tib_vowel(t)) != null) {
			i++;
			st.vowels.push(o);
			if (vowel == null) vowel = o;
			// check for bad ordering
			if (st.finals.length > 0) {
				st.warns.push("Vowel sign \"" + o + "\" found after final sign \"" + ffinal + "\".");
			}
		} else if ((o = tib_final_wylie(t)) != null) {
			i++;
			klass = tib_final_class(t);
			if (o == "^") {
				st.caret = true;
			} else {
				if (o == "H") st.visarga = true;
				st.finals.push(o);
				if (ffinal == null) ffinal = o;
				// check for invalid combinations
				if (st.finals_found.containsKey(klass)) {
					st.warns.push("Final sign \"" + o 
					+ "\" should not combine with found after final sign \"" + ffinal + "\".");
				} else {
					st.finals_found.put(klass, o);
				}
			}
		} else break;
	}
	// now analyze the stack according to various rules
	// a-chen with vowel signs: remove the "a" and keep the vowel signs
	if (st.top == "a" && st.stack.length == 1 && st.vowels.length > 0) st.stack.shift();
	// handle long vowels: A+i becomes I, etc.
	if (st.vowels.length > 1 && st.vowels[0] == "A" && tib_vowel_long(st.vowels[1]) != null) {
		var l = tib_vowel_long(st.vowels[1]);
		st.vowels.shift();
		st.vowels.shift();
		st.vowels.unshift(l);
	}
	// special cases: "ph^" becomes "f", "b^" becomes "v"
	if (st.caret && st.stack.length == 1 && tib_caret(st.top) != null) {
		var l = tib_caret(st.top);
		st.top = l;
		st.stack.shift();
		st.stack.unshift(l);
		st.caret = false;
	}
	st.cons_str = st.stack.join("+");
	// if this is a single consonant, keep track of it (useful for prefix/suffix analysis)
	if (st.stack.length == 1 && st.stack[0] != ("a") && !st.caret 
	&& st.vowels.length == 0 && st.finals.length == 0) {
		st.single_cons = st.cons_str;
	}
	// return the analyzed stack
	st.tokens_used = i - orig_i;
	return st;
}

// Puts an analyzed stack together into Wylie output, adding an implicit "a" if needed.
function putStackTogether(st) {
	var out = '';
	// put the main elements together... stacked with "+" unless it's a regular stack
	if (tib_stack(st.cons_str)) {
	    out += st.stack.join("");
	} else out += (st.cons_str);
	// caret (tsa-phru) goes here as per some (halfway broken) Unicode specs...
	if (st.caret) out += ("^");
	// vowels...
	if (st.vowels.length > 0) {
		out += st.vowels.join("+");
	} else if (!st.prefix && !st.suffix && !st.suff2
	&& (st.cons_str.length == 0 || st.cons_str.charAt(st.cons_str.length - 1) != 'a')) {
		out += "a"
	}
	// final stuff
	out += st.finals.join("");
	if (st.dot) out += ".";
	return out;
}

	// Converts from Unicode strings to Wylie (EWTS) transliteration.
	//
	// Arguments are:
	//    str   : the unicode string to be converted
	//    escape: whether to escape non-tibetan characters according to Wylie encoding.
	//            if escape == false, anything that is not tibetan will be just passed through.
	//
	// Returns: the transliterated string.
	//
	// To get the warnings, call getWarnings() afterwards.

function toWylie(str, warns, escape) {
	if (escape == undefined) escape = true
	var out = ''
	var line = 1
	var units = 0
	// globally search and replace some deprecated pre-composed Sanskrit vowels
	str = str.replace(/\u0f76/g, "\u0fb2\u0f80")
	str = str.replace(/\u0f77/g, "\u0fb2\u0f71\u0f80")
	str = str.replace(/\u0f78/g, "\u0fb3\u0f80")
	str = str.replace(/\u0f79/g, "\u0fb3\u0f71\u0f80")
	str = str.replace(/\u0f81/g, "\u0f71\u0f80")
	var i = 0
	var len = str.length
	// iterate over the string, codepoint by codepoint
	ITER:
	while (i < len) {
		var t = str.charAt(i);
		// found tibetan script - handle one tsekbar
		if (tib_top(t) != null) {
			var tb = toWylieOneTsekbar(str, len, i);
			out += tb.wylie;
			i += tb.tokens_used;
			units++;
			for (var w = 0; w < tb.warns.length; w++) warnl(warns, line, tb.warns[w]);
			if (!escape) i += handleSpaces(str, i, out);
			continue ITER;
		}
		// punctuation and special stuff. spaces are tricky:
		// - in non-escaping mode: spaces are not turned to '_' here (handled by handleSpaces)
		// - in escaping mode: don't do spaces if there is non-tibetan coming, so they become part
		//   of the [escaped block].
		var o = tib_other(t);
		if (o != null && (t != ' ' || (escape && !followedByNonTibetan(str, i)))) {
			out += o;
			i++;
			units++;
			if (!escape) i += handleSpaces(str, i, out);
			continue ITER;
		}
		// newlines, count lines.  "\r\n" together count as one newline.
		if (t == '\r' || t == '\n') {
			line++;
			i++;
			out += t;
			if (t == '\r' && i < len && str.charAt(i) == '\n') {
				i++;
				out += ('\n');
			}
			continue ITER;
		}
		// ignore BOM and zero-width space
		if (t == '\ufeff' || t == '\u200b') {
			i++;
			continue ITER;
		}
		// anything else - pass along?
		if (!escape) {
			out += (t);
			i++;
			continue ITER;
		}
		// other characters in the tibetan plane, escape with \\u0fxx
		if (t >= '\u0f00' && t <= '\u0fff') {
			var c = formatHex(t);
			out += c;
			i++;
			// warn for tibetan codepoints that should appear only after a tib_top
			if (tib_subjoined(t) != null || tib_vowel(t) != null || tib_final_wylie(t) != null) {
				warnl(warns, line, "Tibetan sign " + c + " needs a top symbol to attach to.");
			}
			continue ITER;
		}
		// ... or escape according to Wylie:
		// put it in [comments], escaping [] sequences and closing at line ends
		out += "[";
		while (tib_top(t) == null && (tib_other(t) == null || t == ' ') && t != '\r' && t != '\n') {
			// \escape [opening and closing] brackets
			if (t == '[' || t == ']') {
				out += "\\";
				out += t;
			// unicode-escape anything in the tibetan plane (i.e characters not handled by Wylie)
			} else if (t >= '\u0f00' && t <= '\u0fff') {
				out += formatHex(t);
				// and just pass through anything else!
			} else {
				out += t;
			}
			if (++i >= len) break;
			t = str.charAt(i);
		}
		 out += "]";
	}
	return out;
}
	return {
		fromWylie: fromWylie,
		toWylie: toWylie,
		setopt: setopt,
		getopt: function() { return opt },
		five: function() {
			return 555;
		}
	}
});

