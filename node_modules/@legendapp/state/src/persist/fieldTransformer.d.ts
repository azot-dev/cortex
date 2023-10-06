import { FieldTransforms, TypeAtPath } from '@legendapp/state';
export declare function transformPath(path: string[], pathTypes: TypeAtPath[], map: Record<string, any>): string[];
export declare function transformObject(dataIn: Record<string, any>, map: Record<string, any>): any;
export declare function transformObjectWithPath(obj: object, path: string[], pathTypes: TypeAtPath[], fieldTransforms: FieldTransforms<any>): {
    path: string[];
    obj: object;
};
export declare function invertFieldMap(obj: Record<string, any>): any;
