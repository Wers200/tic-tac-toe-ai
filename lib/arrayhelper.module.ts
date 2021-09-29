//#region Interfaces
interface Dictionary<T> {
    [key: string]: T
}

export interface InfoRayReturn {
    rayPath: Point[],
    numberInfo: Dictionary<number>
}
//#endregion

export class Point {
    X: number;
    Y: number;

    //#region Directions
    static readonly Left = new Point(-1, 0);
    static readonly UpLeft = new Point(-1, -1);
    static readonly Up = new Point(0, -1);
    static readonly UpRight = new Point(1, -1);
    static readonly Right = new Point(1, 0);
    static readonly DownRight = new Point(1, 1);
    static readonly Down = new Point(0, 1);
    static readonly DownLeft = new Point(-1, 1);
    //#endregion

    //#region Repetitions
    static readonly Zero = new Point(0, 0);
    static readonly One = new Point(1, 1);
    static readonly OneInverted = new Point(-1, -1);
    static readonly Empty = new Point(null, null);
    //#endregion

    constructor(x: number, y: number) {
        this.X = x;
        this.Y = y;
    }

    Get1DIndexFrom2D(arrayWidth: number): number {
        return Math.floor(this.Y * arrayWidth + this.X);
    }

    static Get2DIndexFrom1D(index: number, arrayWidth: number): Point {
        return new Point(index % arrayWidth, Math.floor(index / arrayWidth));
    }

    IsOutOfBounds(arraySize: Size): boolean {
        const IsSmallerThanRange = this.X < 0 || this.Y < 0;
        const IsBiggerThanRange = this.X > (arraySize.Width - 1) || this.Y > (arraySize.Height - 1);
        return IsSmallerThanRange || IsBiggerThanRange;
    }
}

export class Size {
    Width: number;
    Height: number;

    constructor(width: number, height: number) {
        this.Width = width;
        this.Height = height;
    }

    get Area(): number {
        return this.Width * this.Height;
    }
}

export class ArrayLogic { 
    static CreateArray(size: Size, fill = 0): number[] {
        let array = new Array<number>(size.Area);
        array.fill(fill);
        return array;
    }

    static ShootCheckerRay(position: Point, step: Point, array: number[], arraySize: Size, requiredNumbers: number[], requiredLength: number, bounce: boolean): boolean {
        for(let i = 0; i < requiredLength; i++) {
            if(i === requiredLength - 1) return true;
            const nextPosition = new Point(position.X + step.X, position.Y + step.Y);
            const isRequiredNumberOnNextPosition = requiredNumbers.includes(array[nextPosition.Get1DIndexFrom2D(arraySize.Width)]);
            const moveConditions = !nextPosition.IsOutOfBounds(arraySize) && isRequiredNumberOnNextPosition;
            if(moveConditions) position = nextPosition;
            else if(bounce) return this.ShootCheckerRay(position, new Point(-step.X , -step.Y), 
            array, arraySize, requiredNumbers, requiredLength, false);
            else return false;
        }
    }

    static ShootCheckerRay2(position: Point, step: Point, array: number[], arraySize: Size, requiredNumbers: number[], requiredLength: number): boolean {
        let firstRayPassed = -1;
        let secondRayPassed = -1;
        let currentOffset = Point.Zero;
        for(let currentLength = 0; currentLength < requiredLength; currentLength++) {
            if(firstRayPassed === -1 || secondRayPassed === -1) currentOffset = new Point(currentOffset.X + step.X, currentOffset.Y + step.Y);
            if(firstRayPassed === -1) {
                const currentPosition = new Point(position.X + currentOffset.X, position.Y + currentOffset.Y);
                const isRequiredNumberOnCurrentPosition = requiredNumbers.includes(array[currentPosition.Get1DIndexFrom2D(arraySize.Width)]);
                const moveConditions = !currentPosition.IsOutOfBounds(arraySize) && isRequiredNumberOnCurrentPosition;
                if(!moveConditions) firstRayPassed = currentLength;
            }
            if(secondRayPassed === -1) {
                const currentPosition = new Point(position.X - currentOffset.X, position.Y - currentOffset.Y);
                const isRequiredNumberOnCurrentPosition = requiredNumbers.includes(array[currentPosition.Get1DIndexFrom2D(arraySize.Width)]);
                const moveConditions = !currentPosition.IsOutOfBounds(arraySize) && isRequiredNumberOnCurrentPosition;
                if(!moveConditions) secondRayPassed = currentLength;
            }
            if(firstRayPassed !== -1 && secondRayPassed !== -1) return (firstRayPassed + secondRayPassed) + 1 === requiredLength;
        } 
    }

    static ShootInfoRay(position: Point, lifetime: number, step: Point, array: number[], arraySize: Size, requiredNumbers: number[], bounce: boolean): InfoRayReturn {
        let info: InfoRayReturn = {
            rayPath: new Array<Point>(),
            numberInfo: {}
        }
        requiredNumbers.forEach(number => info.numberInfo[String(number)] = 0);     
        let numberOnStartPosition = array[position.Get1DIndexFrom2D(arraySize.Width)];
        if(requiredNumbers.includes(numberOnStartPosition) && !position.IsOutOfBounds(arraySize)) {
            info.rayPath.push(position);
            info.numberInfo[numberOnStartPosition]++;
            for(let i = 0; i <= lifetime; i++) {
                const nextPosition = new Point(position.X + step.X, position.Y + step.Y);
                const numberOnNextPosition = array[nextPosition.Get1DIndexFrom2D(arraySize.Width)];
                const isRequiredNumberOnNextPosition = requiredNumbers.includes(numberOnNextPosition);
                const moveConditions = !nextPosition.IsOutOfBounds(arraySize) && isRequiredNumberOnNextPosition;
                if(moveConditions) {
                    info.rayPath.push(nextPosition);
                    info.numberInfo[numberOnNextPosition]++;
                    position = nextPosition;
                }
                else if(bounce) return this.ShootInfoRay(position, lifetime, new Point(-step.X , -step.Y), 
                    array, arraySize, requiredNumbers, false);
            }
        }
        return info;
    }
}