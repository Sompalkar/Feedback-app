// import { createClient } from "@/lib/supabase/client";

// export interface DatabaseError {
//   code: string;
//   message: string;
//   details?: string;
// }

// export async function testDatabaseConnection(): Promise<boolean> {
//   try {
//     const supabase = createClient();
//     const { data, error } = await supabase.from("boards").select("id").limit(1);

//     if (error) {
//       console.error("Database connection test failed:", error);
//       return false;
//     }

//     return true;
//   } catch (err) {
//     console.error("Database connection test error:", err);
//     return false;
//   }
// }

// export async function createBoardWithCategories(
//   boardData: {
//     name: string;
//     slug: string;
//     description?: string;
//     owner_id: string;
//   },
//   categories: { name: string; color: string }[]
// ): Promise<{ success: boolean; board?: any; error?: string }> {
//   const supabase = createClient();

//   try {
//     // Test connection first
//     const connectionOk = await testDatabaseConnection();
//     if (!connectionOk) {
//       return { success: false, error: "Database connection failed" };
//     }

//     console.log("Creating board with data:", boardData);

//     // Create board
//     const { data: board, error: boardError } = await supabase
//       .from("boards")
//       .insert(boardData)
//       .select()
//       .single();

//     if (boardError) {
//       console.error("Board creation error:", boardError);
//       return {
//         success: false,
//         error: `Failed to create board: ${boardError.message}`,
//       };
//     }

//     if (!board?.id) {
//       return { success: false, error: "Board created but no ID returned" };
//     }

//     console.log("Board created successfully:", board);

//     // Verify board ownership before creating categories
//     const { data: boardCheck, error: boardCheckError } = await supabase
//       .from("boards")
//       .select("id, owner_id")
//       .eq("id", board.id)
//       .single();

//     if (boardCheckError || !boardCheck) {
//       console.error("Board ownership verification failed:", boardCheckError);
//       await supabase.from("boards").delete().eq("id", board.id);
//       return { success: false, error: "Failed to verify board ownership" };
//     }

//     if (boardCheck.owner_id !== boardData.owner_id) {
//       console.error("Board ownership mismatch:", {
//         expected: boardData.owner_id,
//         actual: boardCheck.owner_id,
//       });
//       await supabase.from("boards").delete().eq("id", board.id);
//       return { success: false, error: "Board ownership verification failed" };
//     }

//     console.log("Board ownership verified, creating categories...");

//     // Create categories one by one to handle errors better
//     const createdCategories = [];
//     for (const category of categories) {
//       console.log("Creating category:", category);

//       const { data: createdCategory, error: categoryError } = await supabase
//         .from("board_categories")
//         .insert({
//           board_id: board.id,
//           name: category.name.trim(),
//           color: category.color,
//         })
//         .select()
//         .single();

//       if (categoryError) {
//         console.error("Category creation error:", {
//           category,
//           error: categoryError,
//           code: categoryError.code,
//           message: categoryError.message,
//           details: categoryError.details,
//         });

//         // Rollback board creation
//         await supabase.from("boards").delete().eq("id", board.id);

//         // Handle specific error cases
//         if (categoryError.code === "42501") {
//           return {
//             success: false,
//             error:
//               "Permission denied: You don't have permission to create categories for this board",
//           };
//         } else if (categoryError.code === "23505") {
//           return {
//             success: false,
//             error: `Category '${category.name}' already exists in this board`,
//           };
//         } else if (categoryError.code === "23503") {
//           return {
//             success: false,
//             error: "Invalid board reference: The board may have been deleted",
//           };
//         }

//         return {
//           success: false,
//           error: `Failed to create category '${category.name}': ${categoryError.message}`,
//         };
//       }

//       if (!createdCategory) {
//         console.error("No category data returned for:", category);
//         // Rollback board creation
//         await supabase.from("boards").delete().eq("id", board.id);
//         return {
//           success: false,
//           error: `Failed to create category '${category.name}': No data returned`,
//         };
//       }

//       console.log("Category created successfully:", createdCategory);
//       createdCategories.push(createdCategory);
//     }

//     if (createdCategories.length === 0) {
//       console.error("No categories were created");
//       // Rollback board creation
//       await supabase.from("boards").delete().eq("id", board.id);
//       return { success: false, error: "No categories were created" };
//     }

//     console.log("All categories created successfully:", createdCategories);
//     return { success: true, board };
//   } catch (err) {
//     console.error("Unexpected error in createBoardWithCategories:", err);
//     return { success: false, error: "An unexpected error occurred" };
//   }
// }






























































import { createClient } from "@/lib/supabase/client";

export async function createBoardWithCategories(
  boardData: {
    name: string;
    slug: string;
    description?: string;
    owner_id: string;
  },
  categories: { name: string; color: string }[]
): Promise<{ success: boolean; board?: any; error?: string }> {
  const supabase = createClient();

  try {
    // Create board
    const { data: board, error: boardError } = await supabase
      .from("boards")
      .insert(boardData)
      .select()
      .single();

    if (boardError || !board?.id) {
      return {
        success: false,
        error: boardError?.message || "Failed to create board",
      };
    }

    // Create categories using rpc to bypass REST API issues
    const { error: categoriesError } = await supabase.rpc("create_categories", {
      categories: categories.map(c => ({
        board_id: board.id,
        name: c.name.trim(),
        color: c.color
      }))
    });

    if (categoriesError) {
      // Rollback board creation
      await supabase.from("boards").delete().eq("id", board.id);
      return {
        success: false,
        error: `Failed to create categories: ${categoriesError.message}`
      };
    }

    return { success: true, board };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Database error occurred"
    };
  }
}