/*
Provides basic string utility functionality
 */
function StringUtils()
{

    /**
     * Returns true if the src string is NOT blank
     * @param src
     * @return {Boolean}
     */
    this.isNotBlank = function(src)
    {
        return (src != undefined && src != null && src != '' && src.trim() != '');
    }

    /**
     * Returns true if the src is NOT undefined AND NOT null
     * @param src
     * @return {Boolean}
     */
    this.isNotUndAndNull = function(src)
    {
        return (src != undefined && src != null);
    }
}

var stringUtils = new StringUtils();