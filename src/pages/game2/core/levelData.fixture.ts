import * as v from "valibot";

import rawLevelData from "../../../../public/data/level.json";
import { LevelDataSchema, type ILevelData } from "./data";

export const levelDataFixture: ILevelData = v.parse(LevelDataSchema, rawLevelData);
