import React, { useState } from "react";
import "./App.css";
import chrono from "chrono-node";
import { getDateForPage } from "logseq-dateutils";

const App = () => {
    const [searchVal, setSearchVal] = useState("");

    const handleForm = (e: any) => {
        setSearchVal(e.target.value);
    };

    const handleSubmit = async (e: any) => {
        if (e.keyCode === 13) {
            const chronoBlock = chrono.parse(searchVal, new Date(), {
                forwardDate: true,
            });

            if (chronoBlock.length > 0) {
                const startingDate = getDateForPage(
                    chronoBlock[0].start.date(),
                    logseq.settings.preferredDateFormat
                );

                logseq.App.pushState("page", {
                    name: startingDate.substring(2, startingDate.length - 2),
                });

                setSearchVal("");

                const currPBT = await logseq.Editor.getCurrentPageBlocksTree();

                if (currPBT.length > 0) {
                    logseq.hideMainUI({ restoreEditingCursor: true });
                } else {
                    const currPage = await logseq.Editor.getCurrentPage();
                    await logseq.Editor.insertBlock(currPage.name, "", {
                        isPageBlock: true,
                    });

                    logseq.hideMainUI({ restoreEditingCursor: true });
                }
            }
        }
    };

    return (
        <div
            className="search-container flex justify-center border border-black"
            tabIndex={-1}
        >
            <div className=" absolute top-10 bg-white rounded-lg p-3 w-1/3 border">
                <input
                    className="search-field appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                    type="text"
                    placeholder="E.g. tomorrow, 4th July, 6 months later"
                    aria-label="Parse day date"
                    name="searchVal"
                    onChange={handleForm}
                    value={searchVal}
                    onKeyDown={(e) => handleSubmit(e)}
                />
            </div>
        </div>
    );
};

export default App;
