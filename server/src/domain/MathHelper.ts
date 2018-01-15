export class MathHelper {
    private static readonly Radius : number = 6371000;

    private static toRadians(value : number) : number {
        return value * Math.PI / 180;
    }
    
    static calcuateDistance(
        latStart : number,
        lonStart : number,
        latEnd : number,
        lonEnd : number
    ) : number {
		let dLat = MathHelper.toRadians(latEnd - latStart);
		let dLon = MathHelper.toRadians(lonEnd - lonStart);
		let a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
				+ Math.cos(MathHelper.toRadians(latStart))
				* Math.cos(MathHelper.toRadians(latEnd)) * Math.sin(dLon / 2)
				* Math.sin(dLon / 2);
                let c = 2 * Math.asin(Math.sqrt(a));
		return MathHelper.Radius * c;
    }
}