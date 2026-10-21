/* Dante's Ad Forge bottle list: what the name boxes suggest as you type, and what the
   label reader checks its reading against. One brand per line:

     Brand|Expression;Expression;…|Category|Sizes

   "Expression=Category" gives one expression its own category, "-" stands for the brand's
   flagship with no extra name. Sizes are one character each:
     5 = 50 mL   1 = 100 mL   2 = 200 mL   8 = 187 mL   3 = 375 mL   7 = 750 mL
     L = 1 L     M = 1.5 L    H = 1.75 L   X = 3 L
     4 = 4-pack  P = 6-pack   T = 12-pack  U = 24-pack
   Lines starting with # are notes. Add your store's own bottles anywhere. */
window.DAF_BOTTLES=`
# Tequila
Patrón|Silver;Reposado;Añejo;Cristalino;El Cielo;Extra Añejo;Gran Platinum;Gran Burdeos;XO Cafe=Coffee Liqueur;Citrónge Orange=Liqueur|Tequila|5237LH
Don Julio|Blanco;Reposado;Añejo;1942;70 Cristalino;Rosado;Primavera;Alma Miel;Último Reserva;Real|Tequila|537LH
Casamigos|Blanco;Reposado;Añejo;Cristalino;Jalapeño;Mezcal Joven=Mezcal|Tequila|537LH
Clase Azul|Reposado;Plata;Gold;Añejo;Ultra;Día de Muertos;Mezcal Guerrero=Mezcal;Mezcal Durango=Mezcal;Mezcal San Luis Potosí=Mezcal|Tequila|7L
1800|Silver;Reposado;Añejo;Coconut;Cristalino;Milenio;Ultimate Margarita=Cocktail|Tequila|5237LH
Jose Cuervo|Especial Gold;Especial Silver;Tradicional Reposado;Tradicional Silver;Tradicional Añejo;Tradicional Cristalino;Reserva de la Familia;Authentic Margarita=Cocktail|Tequila|52357LH
Espolòn|Blanco;Reposado;Añejo;Cristalino|Tequila|37LH
Hornitos|Plata;Reposado;Añejo;Black Barrel;Cristalino|Tequila|537LH
Teremana|Blanco;Reposado;Añejo|Tequila|537LH
Lunazul|Blanco;Reposado;Añejo|Tequila|37LH
Milagro|Silver;Reposado;Añejo;Select Barrel Reserve|Tequila|37LH
Herradura|Silver;Reposado;Añejo;Ultra;Legend|Tequila|37L
El Jimador|Silver;Reposado;Añejo|Tequila|537LH
Sauza|Silver;Gold;Hacienda Silver;Hacienda Reposado;Conmemorativo Añejo|Tequila|537LH
Cazadores|Blanco;Reposado;Añejo|Tequila|37LH
Olmeca Altos|Plata;Reposado;Añejo|Tequila|37L
Avión|Silver;Reposado;Añejo;Reserva 44|Tequila|37L
Cincoro|Blanco;Reposado;Añejo;Extra Añejo|Tequila|7
Komos|Añejo Cristalino;Reposado Rosa;Extra Añejo|Tequila|7
818|Blanco;Reposado;Añejo|Tequila|7
Maestro Dobel|Diamante;Silver;Reposado;Añejo;50 Cristalino|Tequila|37L
Gran Coramino|Reposado Cristalino;Añejo Cristalino|Tequila|7
Corralejo|Blanco;Reposado;Añejo;1821 Extra Añejo|Tequila|7L
Tres Generaciones|Plata;Reposado;Añejo|Tequila|7
El Tesoro|Blanco;Reposado;Añejo|Tequila|7
Fortaleza|Blanco;Reposado;Añejo|Tequila|7
Siete Leguas|Blanco;Reposado;Añejo|Tequila|7
G4|Blanco;Reposado;Añejo|Tequila|7
Tequila Ocho|Plata;Reposado;Añejo|Tequila|7
Arette|Blanco;Reposado;Añejo|Tequila|7
Tapatio|Blanco;Reposado;Añejo|Tequila|7L
Volcán de mi Tierra|Blanco;Cristalino;Reposado|Tequila|7
Lalo|Blanco|Tequila|7
La Puerta Negra|Blanco;Reposado;Añejo|Tequila|7L
Mi Campo|Blanco;Reposado|Tequila|7L
Código 1530|Blanco;Rosa;Reposado;Añejo|Tequila|7
Casa Noble|Blanco;Reposado;Añejo|Tequila|7
Cabo Wabo|Blanco;Reposado;Añejo|Tequila|7
Dos Artes|Blanco;Reposado;Añejo|Tequila|7L
Pueblo Viejo|Blanco;Reposado;Añejo|Tequila|7LH
Mijenta|Blanco;Reposado;Añejo|Tequila|7
Camarena|Silver;Reposado|Tequila|37LH
Exotico|Blanco;Reposado|Tequila|7LH
Montezuma|White;Gold|Tequila|7LH
# Mezcal
Del Maguey|Vida;Vida de Muertos;Chichicapa|Mezcal|7
400 Conejos|Joven;Reposado|Mezcal|7L
Montelobos|Espadín;Ensamble|Mezcal|7
Dos Hombres|Espadín;Tobalá|Mezcal|7
Ilegal|Joven;Reposado;Añejo|Mezcal|7
Bozal|Ensamble|Mezcal|7
Sombra|Espadín|Mezcal|7
Monte Alban|-|Mezcal|7L
Gusano Rojo|-|Mezcal|7L
# Vodka
Tito's|Handmade Vodka|Vodka|51237LH
Absolut|Original;Citron;Mandrin;Vanilia;Raspberri;Peppar;Lime;Watermelon;Grapefruit;Pears;Elyx|Vodka|52357LH
Smirnoff|No. 21;Blueberry;Watermelon;Peach;Raspberry;Green Apple;Vanilla;Kissed Caramel;Red, White & Berry;Pineapple;Citrus;Spicy Tamarind;Mango|Vodka|52357LH
Grey Goose|Vodka;La Poire;L'Orange;Le Citron;Essences Watermelon & Basil;Essences Strawberry & Lemongrass;Altius|Vodka|5237LH
Ketel One|Vodka;Botanical Cucumber & Mint;Botanical Peach & Orange Blossom;Botanical Grapefruit & Rose;Oranje;Citroen|Vodka|537LH
Cîroc|Vodka;Red Berry;Peach;Pineapple;Coconut;Apple;Mango;Summer Watermelon;French Vanilla;Pomegranate|Vodka|537LH
Belvedere|Vodka;Heritage 176;Single Estate Rye|Vodka|537LH
Stoli|Vodka;Vanil;Razberi;Blueberi;Elit|Vodka|537LH
Svedka|Vodka;Mango Pineapple;Strawberry Lemonade;Blue Raspberry;Cherry Limeade|Vodka|537LH
New Amsterdam|Vodka;Pineapple;Peach;Red Berry;Mango;Coconut;Watermelon;Citron|Vodka|537LH
Pink Whitney|Pink Lemonade Vodka|Vodka|537LH
Deep Eddy|Original;Lemon;Ruby Red;Peach;Lime;Sweet Tea;Cranberry;Orange|Vodka|537LH
Pinnacle|Original;Whipped|Vodka|537LH
Skyy|Vodka|Vodka|537LH
Barton|Vodka|Vodka|537LH
Frïs|Vodka|Vodka|7LH
Wheatley|Vodka|Vodka|7
Western Son|Original;Blueberry;Lemon;Prickly Pear|Vodka|7LH
Burnett's|Vodka;Fruit Punch;Pink Lemonade|Vodka|537LH
Taaka|Vodka|Vodka|537LH
Sobieski|Vodka|Vodka|7LH
Russian Standard|Original;Platinum|Vodka|7L
Chopin|Potato;Rye;Wheat|Vodka|7
Crystal Head|Original;Onyx;Aurora|Vodka|7L
Hangar 1|Straight|Vodka|7
Reyka|Vodka|Vodka|7
Finlandia|Vodka;Cranberry;Grapefruit|Vodka|537LH
Three Olives|Vodka;Cherry;Grape|Vodka|7L
UV|Blue Raspberry;Cake|Vodka|537LH
Popov|Vodka|Vodka|537LH
Nikolai|Vodka|Vodka|537LH
McCormick|Vodka|Vodka|537LH
Aristocrat|Vodka|Vodka|537LH
Effen|Vodka|Vodka|7L
Van Gogh|Vodka|Vodka|7L
Platinum 7X|Vodka|Vodka|7LH
Luksusowa|Potato Vodka|Vodka|7L
# American whiskey
Jack Daniel's|Old No. 7;Tennessee Honey;Tennessee Fire;Tennessee Apple;Tennessee Blackberry;Gentleman Jack;Single Barrel Select;Bonded;Triple Mash;Sinatra Select;Tennessee Rye=Rye Whiskey|Tennessee Whiskey|52357LH
Jim Beam|Original;Black;Honey;Apple;Peach;Vanilla;Red Stag;Devil's Cut;Double Oak;Rye=Rye Whiskey|Bourbon|52357LH
Maker's Mark|Bourbon;46;Cask Strength|Bourbon|537LH
Buffalo Trace|Bourbon|Bourbon|537LH
Eagle Rare|10 Year|Bourbon|7
Blanton's|Single Barrel|Bourbon|7
Weller|Special Reserve;Antique 107;12 Year;Full Proof|Bourbon|7
Woodford Reserve|Bourbon;Double Oaked;Rye=Rye Whiskey|Bourbon|537L
Knob Creek|Small Batch 9 Year;12 Year;Rye=Rye Whiskey|Bourbon|37L
Basil Hayden|Bourbon;Toast;Dark Rye=Rye Whiskey|Bourbon|37L
Bulleit|Bourbon;10 Year;Rye=Rye Whiskey|Bourbon|537LH
Wild Turkey|101;81;Rare Breed;Longbranch;Kentucky Spirit;American Honey=Whiskey Liqueur|Bourbon|537LH
Evan Williams|Black Label;Bottled-in-Bond;1783;Single Barrel;Honey|Bourbon|52357LH
Elijah Craig|Small Batch;Toasted Barrel;Barrel Proof|Bourbon|7L
Four Roses|Bourbon;Small Batch;Single Barrel|Bourbon|7L
Old Forester|86 Proof;100 Proof;1870;1897;1920|Bourbon|7L
Angel's Envy|Bourbon;Rye=Rye Whiskey|Bourbon|7
Michter's|US*1 Bourbon;US*1 Rye=Rye Whiskey;US*1 American Whiskey=American Whiskey|Bourbon|7
Heaven Hill|Bottled in Bond|Bourbon|7L
Old Grand-Dad|Bonded;114|Bourbon|7L
Larceny|Small Batch;Barrel Proof|Bourbon|7
Russell's Reserve|10 Year;Single Barrel|Bourbon|7
Booker's|Bourbon|Bourbon|7
Baker's|7 Year|Bourbon|7
1792|Small Batch;Full Proof|Bourbon|7
Rebel|Bourbon;100|Bourbon|7LH
Old Crow|Bourbon|Bourbon|7LH
Ancient Age|Bourbon|Bourbon|7LH
Jefferson's|Bourbon;Ocean Aged at Sea|Bourbon|7
E.H. Taylor|Small Batch|Bourbon|7
Stagg|Bourbon|Bourbon|7
Elmer T. Lee|Single Barrel|Bourbon|7
Pappy Van Winkle|15 Year;20 Year;23 Year|Bourbon|7
Old Rip Van Winkle|10 Year|Bourbon|7
Uncle Nearest|1856 Premium|Tennessee Whiskey|7
George Dickel|No. 8;No. 12|Tennessee Whiskey|7L
Sazerac|Rye|Rye Whiskey|7
Rittenhouse|Rye|Rye Whiskey|7
High West|American Prairie Bourbon=Bourbon;Double Rye;Rendezvous Rye|Rye Whiskey|7
WhistlePig|PiggyBack 6 Year;10 Year|Rye Whiskey|7
Seagram's 7 Crown|-|American Whiskey|537LH
Skrewball|Peanut Butter Whiskey|Flavored Whiskey|537L
Sheep Dog|Peanut Butter Whiskey|Flavored Whiskey|7L
Fireball|Cinnamon Whisky|Flavored Whiskey|51237LH
# Irish whiskey
Jameson|Irish Whiskey;Black Barrel;Orange;Cold Brew;Caskmates Stout Edition;18 Year|Irish Whiskey|52357LH
Tullamore D.E.W.|Original;12 Year Special Reserve;Honey|Irish Whiskey|537LH
Bushmills|Original;Black Bush;Red Bush;10 Year Single Malt|Irish Whiskey|537LH
Proper No. Twelve|Irish Whiskey;Apple|Irish Whiskey|537LH
Redbreast|12 Year;15 Year|Irish Whiskey|7
Teeling|Small Batch|Irish Whiskey|7
Writers' Tears|Copper Pot|Irish Whiskey|7
Slane|Irish Whiskey|Irish Whiskey|7
Powers|Gold Label|Irish Whiskey|7
# Scotch
Johnnie Walker|Red Label;Black Label;Double Black;Green Label;Gold Label Reserve;18 Year;Blue Label|Scotch Whisky|52357LH
Chivas Regal|12 Year;Extra 13;18 Year;25 Year|Scotch Whisky|537LH
Buchanan's|DeLuxe 12 Year;Special Reserve 18 Year;Master;Two Souls;Pineapple;Red Seal|Scotch Whisky|5237LH
Dewar's|White Label;12 Year;15 Year|Scotch Whisky|537LH
Old Parr|12 Year;Silver;18 Year|Scotch Whisky|7L
J&B|Rare|Scotch Whisky|7LH
Black & White|-|Scotch Whisky|7L
Cutty Sark|-|Scotch Whisky|7LH
Grant's|Triple Wood|Scotch Whisky|7LH
Famous Grouse|-|Scotch Whisky|7LH
Clan MacGregor|-|Scotch Whisky|7LH
Passport|-|Scotch Whisky|7LH
Monkey Shoulder|Blended Malt|Scotch Whisky|7L
Glenfiddich|12 Year;14 Year Bourbon Barrel;15 Year;18 Year;21 Year|Single Malt Scotch|537L
The Glenlivet|12 Year;14 Year;15 Year;18 Year;Founder's Reserve;Caribbean Reserve|Single Malt Scotch|537L
The Macallan|12 Year Double Cask;12 Year Sherry Oak;15 Year Double Cask;18 Year Sherry Oak;Rare Cask|Single Malt Scotch|7
The Balvenie|12 Year DoubleWood;14 Year Caribbean Cask;21 Year PortWood|Single Malt Scotch|7
Lagavulin|16 Year|Single Malt Scotch|7
Laphroaig|10 Year|Single Malt Scotch|7
Oban|14 Year|Single Malt Scotch|7
Talisker|10 Year|Single Malt Scotch|7
Glenmorangie|The Original 10 Year;Lasanta;Quinta Ruban;Nectar d'Or|Single Malt Scotch|7
Highland Park|12 Year|Single Malt Scotch|7
Ardbeg|10 Year;Uigeadail|Single Malt Scotch|7
The Dalmore|12 Year|Single Malt Scotch|7
Aberlour|12 Year;A'bunadh|Single Malt Scotch|7
The Singleton|12 Year|Single Malt Scotch|7
# Japanese and Canadian whisky
Suntory|Toki|Japanese Whisky|7L
Hibiki|Japanese Harmony|Japanese Whisky|7
Yamazaki|12 Year|Japanese Whisky|7
Hakushu|12 Year|Japanese Whisky|7
Nikka|From the Barrel;Coffey Grain;Days|Japanese Whisky|7
Crown Royal|Deluxe;Regal Apple;Peach;Vanilla;Salted Caramel;Blackberry;Reserve;XO;XR;Northern Harvest Rye;Black|Canadian Whisky|52357LH
Canadian Club|1858;Classic 12 Year|Canadian Whisky|537LH
Black Velvet|Original;Toasted Caramel|Canadian Whisky|537LH
Seagram's VO|-|Canadian Whisky|7LH
Canadian Mist|-|Canadian Whisky|537LH
Windsor|-|Canadian Whisky|7LH
Lord Calvert|-|Canadian Whisky|7LH
Pendleton|-|Canadian Whisky|7LH
# Rum
Bacardí|Superior;Gold;Black;Spiced;Reserva Ocho;Gran Reserva Diez;Limón;Coconut;Dragon Berry;Pineapple;Mango Chile;Raspberry|Rum|52357LH
Captain Morgan|Original Spiced;White;Private Stock;100 Proof;Sliced Apple|Spiced Rum|52357LH
Malibu|Coconut;Pineapple;Mango;Passion Fruit;Strawberry|Rum|5237LH
Don Q|Cristal;Gold;Añejo;Gran Añejo;Coco;Limón;Pasión|Rum|537LH
Cruzan|Aged Light;Aged Dark;Coconut;Mango;Pineapple;Black Strap;9 Spiced;Single Barrel|Rum|537LH
The Kraken|Black Spiced|Spiced Rum|537LH
Sailor Jerry|Spiced|Spiced Rum|537LH
Diplomático|Reserva Exclusiva;Mantuano;Planas|Rum|7
Ron Zacapa|23 Solera;XO|Rum|7
Mount Gay|Eclipse;Black Barrel;XO|Rum|7L
Appleton Estate|Signature;8 Year;12 Year Rare Casks|Rum|7L
Goslings|Black Seal|Rum|7L
Havana Club|Añejo Blanco;Añejo Clásico|Rum|7L
Flor de Caña|4 Extra Seco;7 Gran Reserva;12 Centenario;18 Centenario|Rum|7L
Brugal|Añejo;Extra Viejo;1888|Rum|7L
Ron Barceló|Añejo;Imperial;Gran Añejo|Rum|7L
Planteray|3 Stars;Original Dark;Stiggins' Fancy Pineapple|Rum|7
Myers's|Original Dark|Rum|7L
Bumbu|Original;XO;Crème=Cream Liqueur|Rum|7
Parrot Bay|Coconut;Pineapple|Rum|537LH
Blue Chair Bay|Coconut;Banana;Vanilla|Rum|7L
Admiral Nelson's|Spiced|Spiced Rum|537LH
Ron Matusalem|Gran Reserva 15|Rum|7
Pyrat|XO Reserve|Rum|7
El Dorado|12 Year;15 Year|Rum|7
Ron Abuelo|Añejo;7 Años;12 Años|Rum|7L
Santa Teresa|1796|Rum|7
Ron Medellín|Añejo;Extra Añejo|Rum|7L
Ron Viejo de Caldas|Tradicional|Rum|7L
Ron Bermúdez|Aniversario|Rum|7L
Don Papa|Original|Rum|7
Calico Jack|Spiced|Spiced Rum|537LH
Castillo|Silver;Gold;Spiced|Rum|537LH
Wray & Nephew|White Overproof|Rum|7L
# Cognac and brandy
Hennessy|VS;VSOP Privilège;XO;Paradis;Master Blender's Selection|Cognac|5237LH
Rémy Martin|VSOP;1738 Accord Royal;XO|Cognac|5237LH
Courvoisier|VS;VSOP;XO|Cognac|5237LH
Martell|Blue Swift;VS Single Distillery;Cordon Bleu;XO|Cognac|537L
D'USSÉ|VSOP;XO|Cognac|537L
Camus|VS;VSOP;XO|Cognac|7
E&J|VS;VSOP;XO;Apple;Peach;Vanilla|Brandy|52357LH
Christian Brothers|VS;Honey|Brandy|537LH
Paul Masson|Grande Amber VS;Peach;Apple|Brandy|537LH
Korbel|California Brandy|Brandy|7LH
Presidente|Brandy|Brandy|7LH
Torres|10 Gran Reserva|Brandy|7
Fundador|Solera Reserva|Brandy|7L
Don Pedro|-|Brandy|7L
# Gin
Tanqueray|London Dry;No. Ten;Rangpur;Sevilla Orange|Gin|537LH
Bombay|Sapphire;Bramble;Original|Gin|537LH
Beefeater|London Dry;Pink Strawberry;Blood Orange|Gin|537LH
Hendrick's|Gin;Neptunia;Flora Adora|Gin|537L
Gordon's|London Dry;Pink|Gin|537LH
Seagram's|Extra Dry Gin;Lime Twisted;Peach Twisted|Gin|537LH
Aviation|American Gin|Gin|7
Roku|Gin|Gin|7
The Botanist|Islay Dry Gin|Gin|7
Empress 1908|Indigo Gin;Elderflower Rose|Gin|7
Malfy|Con Limone;Rosa;Originale|Gin|7
Nolet's|Silver Dry Gin|Gin|7
Gin Mare|Mediterranean Gin|Gin|7
# Liqueurs and schnapps
Baileys|Original Irish Cream;Salted Caramel;Espresso Crème;Strawberries & Cream;Vanilla Cinnamon|Cream Liqueur|52357L
Kahlúa|Coffee Liqueur;Mint Mocha;Vanilla|Coffee Liqueur|537L
Grand Marnier|Cordon Rouge|Liqueur|537L
Cointreau|Orange Liqueur|Liqueur|537L
Disaronno|Originale|Liqueur|537L
Jägermeister|Original;Cold Brew Coffee|Liqueur|52357L
Hpnotiq|-|Liqueur|537L
RumChata|-|Cream Liqueur|537L
Licor 43|Original;Orochata;Baristo|Liqueur|7L
St-Germain|Elderflower Liqueur|Liqueur|7
Chambord|Black Raspberry Liqueur|Liqueur|537
Frangelico|Hazelnut Liqueur|Liqueur|7
Southern Comfort|Original;100 Proof|Liqueur|537LH
Aperol|Aperitivo|Liqueur|7L
Campari|-|Liqueur|7L
Midori|Melon Liqueur|Liqueur|7L
Tequila Rose|Strawberry Cream|Cream Liqueur|537L
Godiva|Chocolate Liqueur|Cream Liqueur|7
Amarula|Cream|Cream Liqueur|7L
Drambuie|-|Liqueur|7
Galliano|L'Autentico|Liqueur|7
Alizé|Gold Passion;Red Passion;Bleu|Liqueur|537L
X-Rated|Fusion Liqueur|Liqueur|7
Kinky|Pink;Blue|Liqueur|537L
Caravella|Limoncello|Liqueur|7
Pallini|Limoncello|Liqueur|7
Bols|Blue Curaçao;Triple Sec;Peach|Liqueur|7L
Luxardo|Maraschino|Liqueur|7
Fernet-Branca|-|Liqueur|7
Ancho Reyes|Original;Verde|Liqueur|7
Goldschläger|Cinnamon Schnapps|Schnapps|537L
Rumple Minze|Peppermint Schnapps|Schnapps|537L
Dr. McGillicuddy's|Mentholmint;Cherry;Butterscotch;Vanilla|Schnapps|537L
DeKuyper|Peachtree;Sour Apple Pucker;Buttershots;Triple Sec;Blue Curaçao;Watermelon Pucker|Schnapps|537L
# Aguardiente, cachaça, pisco
Aguardiente Antioqueño|Tapa Roja;Sin Azúcar|Aguardiente|37L
Aguardiente Néctar|Club;Azul;Verde|Aguardiente|7L
Aguardiente Cristal|-|Aguardiente|7L
Cachaça 51|-|Cachaça|7L
Ypióca|Ouro;Prata|Cachaça|7L
Leblon|-|Cachaça|7
Pitú|-|Cachaça|7L
BarSol|Primero Quebranta|Pisco|7
# Champagne and sparkling wine
Moët & Chandon|Impérial Brut;Rosé Impérial;Nectar Impérial;Ice Impérial|Champagne|837M
Veuve Clicquot|Yellow Label Brut;Rosé;Rich;La Grande Dame|Champagne|37M
Dom Pérignon|Vintage;Rosé|Champagne|7
Armand de Brignac|Ace of Spades Brut Gold;Rosé|Champagne|7
Perrier-Jouët|Grand Brut;Belle Époque|Champagne|7
Taittinger|Brut La Française|Champagne|7
G.H. Mumm|Grand Cordon|Champagne|7
Nicolas Feuillatte|Réserve Exclusive Brut|Champagne|7
Laurent-Perrier|La Cuvée;Cuvée Rosé|Champagne|7
Ruinart|Blanc de Blancs;Rosé|Champagne|7
Louis Roederer|Cristal;Collection|Champagne|7
Freixenet|Cordon Negro Brut;Prosecco=Prosecco;Italian Rosé|Sparkling Wine|87M
La Marca|Prosecco|Prosecco|87
Mionetto|Prosecco Brut|Prosecco|87
Korbel|Brut;Extra Dry|Sparkling Wine|87M
Cook's|Brut;Extra Dry|Sparkling Wine|7
André|Brut;Extra Dry;Spumante|Sparkling Wine|7
Chandon|Brut;Garden Spritz|Sparkling Wine|87
Martini & Rossi|Asti;Prosecco|Sparkling Wine|7
# Wine
Barefoot|Cabernet Sauvignon=Red Wine;Merlot=Red Wine;Pinot Noir=Red Wine;Chardonnay;Pinot Grigio;Moscato;Pink Moscato=Rosé;Red Moscato=Red Wine|White Wine|7M
Yellow Tail|Shiraz=Red Wine;Cabernet Sauvignon=Red Wine;Merlot=Red Wine;Chardonnay;Moscato;Pinot Grigio|White Wine|7M
Josh Cellars|Cabernet Sauvignon=Red Wine;Pinot Noir=Red Wine;Chardonnay|White Wine|7
Meiomi|Pinot Noir=Red Wine;Chardonnay|White Wine|7
Kendall-Jackson|Vintner's Reserve Chardonnay;Vintner's Reserve Cabernet Sauvignon=Red Wine|White Wine|7M
Apothic|Red;Dark;Inferno|Red Wine|7
19 Crimes|Red Blend;Cabernet Sauvignon;Snoop Cali Red|Red Wine|7
Stella Rosa|Black;Red;Pink=Rosé;Peach=White Wine;Moscato d'Asti=White Wine|Red Wine|7M
Sutter Home|Moscato;White Zinfandel=Rosé|White Wine|87M
Woodbridge|Cabernet Sauvignon=Red Wine;Chardonnay|White Wine|7M
Kim Crawford|Sauvignon Blanc|White Wine|7
Santa Margherita|Pinot Grigio|White Wine|7
Whispering Angel|Rosé|Rosé|7M
Caymus|Cabernet Sauvignon|Red Wine|7
Casillero del Diablo|Cabernet Sauvignon=Red Wine;Malbec=Red Wine;Sauvignon Blanc|White Wine|7
Riunite|Lambrusco|Red Wine|7M
# Beer, seltzer and ready to drink
Corona|Extra;Light;Premier;Familiar|Beer|PTU
Modelo|Especial;Negra|Beer|PTU
Heineken|Original;0.0|Beer|PTU
Michelob Ultra|-|Beer|PTU
Bud Light|-|Beer|PTU
Budweiser|-|Beer|PTU
Coors Light|-|Beer|PTU
Miller Lite|-|Beer|PTU
Stella Artois|-|Beer|PTU
Pacífico|Clara|Beer|PTU
Dos Equis|Lager Especial;Ambar|Beer|PTU
Presidente|Beer;Light|Beer|PTU
Guinness|Draught|Beer|PT
Blue Moon|Belgian White|Beer|PT
Yuengling|Traditional Lager|Beer|PTU
White Claw|Variety Pack;Black Cherry;Mango;Natural Lime|Hard Seltzer|PT
High Noon|Variety Pack;Pineapple;Peach;Watermelon|Hard Seltzer|4T
Truly|Variety Pack|Hard Seltzer|PT
Twisted Tea|Original|Hard Iced Tea|PTU
Mike's Hard Lemonade|Original|Hard Lemonade|PT
Smirnoff Ice|Original|Malt Beverage|PT
Cutwater|Lime Margarita;Mai Tai;Vodka Mule|Cocktail|4
BuzzBallz|Chili Mango;Tequila 'Rita;Choc Tease|Cocktail|2
`;
