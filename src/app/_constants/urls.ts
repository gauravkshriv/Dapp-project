export class Url {
    /**
     * FRONTEND : Account Test URL
     */
    public static get ACC_TEST(): string { return "http://accounttest.s3-website.us-east-2.amazonaws.com"; };
     /**
     * FRONTEND : Account URL
     */
    public static get ACC(): string { return "http://account.rmehub.in"; };
     /**
     * FRONTEND : RETAIL URL
     */
    public static get RETAIL(): string { return "http://retail.rmehub.in"; };
     /**
     * FRONTEND : RETAIL Test URL
     */
    public static get RETAIL_TEST(): string { return "http://commtest.rmehub.in.s3-website.us-east-2.amazonaws.com"; };
    
     /**
     * FRONTEND : REMHUB URL
     */
    public static get REMHUB(): string { return "https://www.rmehub.in"; };
    /**
     * FRONTEND : REMHUB URL
     */
    public static get ACADEMY(): string { return "http://academy.rmehub.in"; };
     /**
     * FRONTEND : COMMUNITY URL
     */
    public static get COMMUNITY(): string { return "http://community.rmehub.in"; };
     /**
     * FRONTEND : DAPP Test URL
     */
    public static get DAPP_TEST(): string { return "http://dmctest.rmehub.in.s3-website.us-east-2.amazonaws.com"; };
     /**
     * FRONTEND : DAPP URL
     */
    public static get DAPP(): string { return "http://dapp.rmehub.in"; };
    /**
     * BACKEND : DAPP Test URL
     */
    public static get BASE(): string { return "http://ec2-34-201-30-149.compute-1.amazonaws.com"; };
    /**
     * BACKEND : PIN Code URL
     */
    public static get PIN(): string { return "http://ec2-34-201-30-149.compute-1.amazonaws.com/pin/taluka/district?pinCode="; };
    /**
     * BACKEND : Land Upload URL 
     */ 
    public static get LAND(): string { return "http://ec2-18-205-3-237.compute-1.amazonaws.com"; };
    /**
     * BACKEND : Land Upload Test URL currently not available
     */
    // public static get LAND_TEST(): string { return "http://ec2-3-221-158-109.compute-1.amazonaws.com"; };
    /**
     * BACKEND : Auth Test URL
     */
    public static get AUTH_TEST(): string { return "http://ec2-18-223-238-93.us-east-2.compute.amazonaws.com"; };
    /**
     * BACKEND : Need Analysis URL
     */
    public static get NEED(): string { return "http://ec2-34-234-215-47.compute-1.amazonaws.com"; };
  }