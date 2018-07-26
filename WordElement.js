"use strict";

class WordElement
{
	constructor(dom, text)
	{
		this.span = dom.createElement("span");
		this.span.textContent = text;
		this.span.setAttribute(WordElement.ATTRIBUTE_NAME, WordElement.ATTRIBUTE_UNDEFINED);
		
		this.word = text.toLowerCase();
		this.match = null;
		this.hidden = false;
		
		this.mouseOver  = new WordElementEvent();
		this.mouseOut   = new WordElementEvent();
		this.click      = new WordElementEvent();
		
		this.span.addEventListener("mouseover",
			(function onMouseOver(e)
			{
				if (!this.hidden)
				{
					this.mouseOver.dispatchEvent(
						{ target: this, domEvent: e }
					);
				}
			}).bind(this)
		);
		this.span.addEventListener("mouseout",
			(function onMouseOut(e)
			{
				if (!this.hidden)
				{
					this.mouseOut.dispatchEvent(
						{ target: this, domEvent: e }
					);
				}
			}).bind(this)
		);
		this.span.addEventListener("click",
			(function onClick(e)
			{
				if (!this.hidden)
				{
					this.click.dispatchEvent(
						{ target: this, domEvent: e }
					);					
				}
			}).bind(this)
		);
	}
	
	hide()
	{
		this.span.setAttribute(WordElement.ATTRIBUTE_NAME, WordElement.ATTRIBUTE_HIDDEN);
		this.hidden = true;
	}
	
	show()
	{
		if (this.match)
		{
			if (this.hasExactMatch())
			{
				this.span.setAttribute(WordElement.ATTRIBUTE_NAME, WordElement.ATTRIBUTE_DEFINED);
			}
			else
			{
				this.span.setAttribute(WordElement.ATTRIBUTE_NAME, WordElement.ATTRIBUTE_SIMILAR);
			}
		}
		else
		{
			this.span.setAttribute(WordElement.ATTRIBUTE_NAME, WordElement.ATTRIBUTE_UNDEFINED);
		}
		this.hidden = false;
	}
	
	setData(match)
	{
		// Assign data
		this.match = match;
		
		// Style word
		if (match.exact)
		{
			this.span.setAttribute(WordElement.ATTRIBUTE_NAME, WordElement.ATTRIBUTE_DEFINED);
		}
		else
		{
			this.span.setAttribute(WordElement.ATTRIBUTE_NAME, WordElement.ATTRIBUTE_SIMILAR);
		}
	}
	
	getWord()
	{
		return this.word;
	}
	
	getDefinition()
	{
		if (this.match)
		{
			return this.match.definition;
		}
		else
		{
			return null;
		}
	}
	
	getMatch()
	{
		return this.match;
	}
	
	hasExactMatch()
	{
		if (this.match)
		{
			return this.match.exact;
		}
		else
		{
			return false;
		}
	}

	hasMatch()
	{
		return this.match !== null;
	}
	
	showPopup()
	{
		if (!this.popup)
		{
			// Create popup
			this.popup = document.createElement("span");
			document.body.prepend(this.popup);
			this.popup.style.display = "none";
			this.popupBubble = this.popup.appendChild(document.createElement("span"));
			this.popupTail = this.popup.appendChild(document.createElement("span"));
		
			// Style popup
			Object.assign(this.popup.style, WordElement.Styles.POPUP);
			Object.assign(this.popupBubble.style, WordElement.Styles.BUBBLE);		
			Object.assign(this.popupTail.style, WordElement.Styles.TAIL);
		}
		
		// Set display text
		this.popupBubble.innerHTML = this.match.entry.definition;			
		
		this.popup.style.display = "block";
		
		var wordLeft = this.span.getBoundingClientRect().left + pageXOffset;
		var wordTop  = this.span.getBoundingClientRect().top + pageYOffset;
		var wordWidth = this.span.getBoundingClientRect().width;
		var wordHeight = this.span.getBoundingClientRect().height;
		var popupHeight = this.popup.scrollHeight;
		var popupWidth = this.popup.scrollWidth;
		
		this.popup.style.left = (wordLeft + (wordWidth - popupWidth)/2) + "px";
		
		// Popup is near top of page
		if (wordTop - this.popupBubble.scrollHeight - 5 < 0)
		{
			Object.assign(this.popupTail.style, WordElement.Styles.TAIL_BOTTOM);
			this.popup.style.top = (wordTop + wordHeight + 5) + "px";
			this.popupTail.style.top = "-5px";
			this.popupTail.style.left = (this.popupBubble.scrollWidth - 10)/2 + "px";
		}
		// Popup is not near top of page
		else
		{
			Object.assign(this.popupTail.style, WordElement.Styles.TAIL_TOP);
			this.popup.style.top = (wordTop - this.popupBubble.scrollHeight - 5) + "px";
			this.popupTail.style.top = this.popupBubble.scrollHeight + "px";
			this.popupTail.style.left = (this.popupBubble.scrollWidth - 10)/2 + "px";
		}
	}
	
	hidePopup()
	{
		if (this.popup)
		{
			this.popup.style.display = "none";
		}
	}
}
Object.assign(WordElement,
	{	
		ATTRIBUTE_NAME      : "wordology_word",
		ATTRIBUTE_UNDEFINED : "not_defined",
		ATTRIBUTE_DEFINED   : "defined",
		ATTRIBUTE_SIMILAR   : "similar",
		ATTRIBUTE_HIDDEN    : "hidden"
	}
);

WordElement.Styles =
{
	WORD: {
		display: "inline-block",
		padding: "0px",
		borderRadius: "0px",
		position: "relative"
	},

	WORD_HIDDEN: {
		backgroundColor: "transparent"
	},
	
	WORD_UNDEFINED: {
		backgroundColor: "rgba(255, 100, 100, 0.33)"
	},

	WORD_DEFINED:
	{
		backgroundColor: "rgba(100, 255, 100, 0.5)"
	},
	
	POPUP: {
		position: "absolute",
		zIndex: "999999999"
	},
	
	BUBBLE: {
		backgroundColor: "hsla(0, 0%, 20%, 1.0)",
		color: "white",
		padding: "7px",
		fontSize: "12pt",
		minHeight: "0px",
		verticalAlign: "baseline",
		fontFamily: "sans-serif",
		fontWeight: "normal",
		fontStyle: "normal",
		textTransform: "none",
		whiteSpace : "nowrap",
		position: "absolute",
		top : "0px",
		left : "0px",
		lineHeight: "1.0em",
		height: "auto",
		display: "block",
		textStyle: "none"
	},
	
	TAIL: {
		width: "0px",
		display: "block",
		position: "absolute"
	},
	
	TAIL_TOP: {
		width: "0px",
		borderTop: "5px solid hsla(0, 0%, 20%, 1.0)",
		borderRight: "5px solid transparent",
		borderLeft: "5px solid transparent"
	},
	
	TAIL_BOTTOM: {
		width: "0px",
		borderBottom: "5px solid hsla(0, 0%, 20%, 1.0)",
		borderRight: "5px solid transparent",
		borderLeft: "5px solid transparent"
	}
};

class WordElementEvent
{
	constructor()
	{
		this.listeners = [];
	}
	
	addListener(f)
	{
		this.listeners.push(f);
	}
	
	dispatchEvent(details)
	{
		for (var f of this.listeners)
		{
			f(details);
		}
	}
}
